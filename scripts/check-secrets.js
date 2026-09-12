#!/usr/bin/env node

/**
 * TermSight v2 Secret Leak Scanner
 * Scans git staged files and workspace for accidental credential leaks.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SECRET_PATTERNS = [
  { name: 'NVIDIA API Key', regex: /nvapi-[A-Za-z0-9_-]{30,}/g },
  { name: 'OpenAI Secret Key', regex: /sk-(?:proj-)?[A-Za-z0-9_-]{24,}/g },
  { name: 'Anthropic API Key', regex: /sk-ant-[A-Za-z0-9_-]{24,}/g },
  { name: 'Groq API Key', regex: /gsk_[A-Za-z0-9_-]{24,}/g },
  { name: 'Google API Key', regex: /AIzaSy[A-Za-z0-9_-]{33}/g },
  { name: 'Generic Private Key', regex: /-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY-----/g },
  { name: 'High-Risk JWT / Service Key', regex: /eyJhbGciOi[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{40,}/g },
];

const FORBIDDEN_FILES = [
  /^\.env(\.local|\.production|\.development)?$/i,
  /.*\.pem$/i,
  /.*\.key$/i,
  /.*id_rsa$/i,
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return output.split('\n').map((f) => f.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function getStagedDiff() {
  try {
    return execSync('git diff --cached -U0', { encoding: 'utf8' });
  } catch {
    return '';
  }
}

console.log('🔍 Running TermSight v2 Secret Scanner...');

let violations = 0;
const stagedFiles = getStagedFiles();

// 1. Check for forbidden files staged for commit
for (const file of stagedFiles) {
  const base = path.basename(file);
  // Allow explicit .env.example
  if (base.toLowerCase() === '.env.example') continue;

  for (const pattern of FORBIDDEN_FILES) {
    if (pattern.test(base)) {
      console.error(`❌ BLOCKED: Secret file staged for commit: "${file}"`);
      violations++;
    }
  }
}

// 2. Check diff content of staged changes
const diff = getStagedDiff();
if (diff) {
  const lines = diff.split('\n');
  for (const line of lines) {
    // Only inspect added lines
    if (!line.startsWith('+') || line.startsWith('+++')) continue;

    for (const { name, regex } of SECRET_PATTERNS) {
      if (regex.test(line)) {
        console.error(`❌ BLOCKED: Potential ${name} detected in staged code:`);
        console.error(`   ${line.trim().slice(0, 80)}...`);
        violations++;
      }
    }
  }
}

// 3. Fallback: If no files staged, scan tracked files for leaked keys
if (stagedFiles.length === 0) {
  try {
    const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => Boolean(f) && !f.startsWith('node_modules/') && !f.startsWith('dist/'));

    for (const relPath of trackedFiles) {
      if (relPath.endsWith('.png') || relPath.endsWith('.jpg') || relPath.endsWith('.svg') || relPath.endsWith('.ico')) continue;
      if (path.basename(relPath).toLowerCase() === '.env.example') continue;

      if (fs.existsSync(relPath)) {
        const content = fs.readFileSync(relPath, 'utf8');
        for (const { name, regex } of SECRET_PATTERNS) {
          if (regex.test(content)) {
            console.error(`❌ BLOCKED: Potential ${name} found in tracked file "${relPath}"`);
            violations++;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not scan tracked files:', err.message);
  }
}

if (violations > 0) {
  console.error(`\n🚨 Scan failed with ${violations} security violation(s). Commit aborted.`);
  process.exit(1);
} else {
  console.log('✅ Secret scan clean: No secrets or credentials detected.');
  process.exit(0);
}
