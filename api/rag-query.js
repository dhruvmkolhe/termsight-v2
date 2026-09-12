export const RAG_SYSTEM_PROMPT = `You are a world-class Legal RAG (Retrieval-Augmented Generation) Expert and Contract Auditor.
You are given a user query and a set of highly relevant, retrieved SENTENCE WINDOWS from a legal contract.
Each window contains:
- Focal Sentence (the exact matched sentence in the agreement)
- Surrounding Sentence Window (the context sentences before and after)
- Section Title & Line Number

YOUR TASK:
1. Answer the user's question directly, clearly, and concisely in Plain English based strictly on the retrieved sentence windows.
2. Cite the exact Section Title and Line Number for evidence.
3. Determine the Risk Verdict:
   - "HIGH RISK": Predatory clauses, asymmetric indemnities, extreme auto-renewals, perpetual IP grants, unilateral modification, uncapped liabilities.
   - "CAUTION": Strict limitation of liability, harsh non-competes, one-sided termination notice, payment delay penalties.
   - "SAFE": Standard, fair, or balanced commercial terms.
4. Provide 2-3 concise Key Insights bullets.
5. Provide 1 actionable takeaway / recommendation for what the user or lawyer should negotiate.

OUTPUT FORMAT:
Return ONLY a valid raw JSON object (no markdown code fences, no extra text) with these exact keys:
{
  "answer": "string (1-3 sentences plain-English direct answer with citations)",
  "riskVerdict": "HIGH RISK" | "CAUTION" | "SAFE",
  "confidenceScore": number between 75 and 99,
  "keyInsights": ["string bullet 1", "string bullet 2"],
  "actionableAdvice": "string (practical advice for negotiation or protection)"
}`;

import { applyCors, validatePayloadSize } from './_security.js';

function cleanAndParse(raw) {
  if (typeof raw !== 'string') throw new Error('Empty AI response');
  let cleaned = raw
    .trim()
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.slice(firstBrace, lastBrace + 1);
    return JSON.parse(candidate);
  }

  throw new Error('Could not parse JSON response');
}

async function callNvidia(prompt, userContent) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b',
        temperature: 0.1,
        max_tokens: 1500,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userContent },
        ],
      }),
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`NVIDIA status ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function callOpenAI(prompt, userContent) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userContent },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI status ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

async function callAnthropic(prompt, userContent) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      temperature: 0.1,
      system: prompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic status ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text;
}

async function callGemini(prompt, userContent) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: prompt }] },
      contents: [{ parts: [{ text: userContent }] }],
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) throw new Error(`Gemini status ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

async function callGroq(prompt, userContent) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userContent },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq status ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const payloadCheck = validatePayloadSize(req, 150 * 1024);
    if (!payloadCheck.valid) {
      return res.status(413).json({ error: payloadCheck.error });
    }

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body. Expected JSON object.' });
    }

    const { query, windows, documentTitle, language = 'en' } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    if (query.trim().length > 1000) {
      return res.status(400).json({ error: 'Query exceeds maximum length of 1,000 characters.' });
    }

    if (!Array.isArray(windows) || windows.length === 0) {
      return res.status(400).json({ error: 'No sentence windows provided' });
    }

    // Cap windows array and sanitize each window
    const safeWindows = windows.slice(0, 20).filter((w) => w && typeof w === 'object');
    if (safeWindows.length === 0) {
      return res.status(400).json({ error: 'Invalid sentence windows structure' });
    }

    // Format retrieved windows for AI context
    const formattedWindows = safeWindows.map((w, i) => {
      const section = typeof w.sectionTitle === 'string' ? w.sectionTitle.slice(0, 100) : 'General';
      const line = typeof w.lineNumber === 'number' || typeof w.lineNumber === 'string' ? w.lineNumber : 'N/A';
      const focal = typeof w.focalSentence === 'string' ? w.focalSentence.slice(0, 1500) : '';
      const winText = typeof w.windowText === 'string' ? w.windowText.slice(0, 3000) : '';
      const domain = typeof w.domainCategory === 'string' ? w.domainCategory.slice(0, 50) : 'general';

      return `[WINDOW #${i + 1}]
Section: ${section}
Line Number: ${line}
Focal Sentence: "${focal}"
Surrounding Context Window: "${winText}"
Domain: ${domain}`;
    }).join('\n\n');

    const userMessage = `DOCUMENT: ${documentTitle || 'Legal Agreement'}
LANGUAGE: ${language}

USER QUESTION: "${query}"

RETRIEVED SENTENCE WINDOWS:
${formattedWindows}

Synthesize a precise legal answer citing these windows.`;

    const providers = [callNvidia, callOpenAI, callAnthropic, callGemini, callGroq];
    for (const provider of providers) {
      try {
        const raw = await provider(RAG_SYSTEM_PROMPT, userMessage);
        if (raw) {
          const parsed = cleanAndParse(raw);
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn('RAG provider fallback:', err.message);
      }
    }

    // Fallback response if no LLM keys are configured
    const topWin = windows[0];
    return res.status(200).json({
      answer: `Based on clause "${topWin.sectionTitle}" (Line ${topWin.lineNumber}): ${topWin.focalSentence}`,
      riskVerdict: 'CAUTION',
      confidenceScore: topWin.relevanceScore || 85,
      keyInsights: [
        `Identified in ${topWin.sectionTitle} at line ${topWin.lineNumber}`,
        `Context window provides surrounding operational conditions.`,
      ],
      actionableAdvice: 'Verify whether this clause is mutual and standard for your industry.',
    });
  } catch (err) {
    console.error('RAG API Error:', err);
    return res.status(500).json({ error: 'RAG analysis failed' });
  }
}
