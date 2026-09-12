# TermSight v2 — AI Contract & Terms of Service Auditor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple.svg)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.2-38bdf8.svg)](https://tailwindcss.com/)

> **You clicked accept. We read it for you.**  
> Instant, plain-language audit of Terms of Service, EULAs, Privacy Policies, and Freelance Agreements. Uncover predatory clauses, forced arbitration traps, unilateral amendments, and score contracts on a 0–100 fairness scale.

---

## 🚀 What's New in Version 2.0

TermSight v2 is a major architectural evolution featuring zero context loss retrieval, side-by-side version comparison, and client-side privacy protection:

- 🧠 **Sentence-Window RAG Engine (V2)**: Discrete legal sentence retrieval indexing with context expansion (+/- 2 neighbor window) eliminating context truncation on 50+ page enterprise agreements.
- 🔀 **Contract Diff (Compare) Mode**: Side-by-side diff auditor comparing original vs renewed terms to detect sneaky amendment traps, added liability waivers, and fairness score regressions.
- ⚖️ **Executive Verdict & Pre-Signing Checklist**: Actionable signing verdicts (*SAFE TO SIGN*, *NEGOTIATE FIRST*, *DO NOT SIGN AS-IS*) backed by an interactive diligence checklist.
- 📜 **Formal Legal Notice Generator**: Pre-drafted, printable formal letters for **30-Day Arbitration Opt-Out**, **GDPR/CCPA Data Purge & AI Revocation**, and **Immediate Cancellation**.
- 🛡️ **Client-Side Privacy Shield**: Pre-processes and redacts sensitive PII (names, emails, phone numbers, Tax IDs/SSNs, dollar compensation figures) in-browser before any payload is dispatched to AI models.
- 🌐 **8-Language Multilingual Core**: Full localized UI and multilingual legal reasoning in **English**, **Spanish (Español)**, **French (Français)**, **German (Deutsch)**, **Hindi (हिन्दी)**, **Japanese (日本語)**, **Chinese (中文)**, and **Portuguese (Português)**.
- ⚡ **SEO & Performance Engineered**: Sub-3s production builds, code-split lazy routes, dedicated crawlable standalone `/privacy` and `/terms` pages, JSON-LD structured schemas, dynamic canonical parity, and AI crawler guidance (`llms.txt`).
- 🔓 **100% Free & Ephemeral**: No login or credit card required. Documents are analyzed strictly in volatile memory and never permanently stored.

---

## 🌟 Core Feature Matrix

| Feature | Description |
|---|---|
| **Multi-Source Ingestion** | Raw text paste with live word/char counters, drag-and-drop file ingestion (`.pdf`, `.docx`, `.txt`, `.md`, `.html`), or direct URL scraping. |
| **Clause Risk Tiers** | Color-coded categorization into **Red Flags** (High Risk), **Caution** (Unfavorable), and **Standard** (Safe) with verbatim contract excerpts and plain-language summaries. |
| **Fairness & Health Scorecard** | Computes a weighted 0–100 contract fairness score with letter grades (**A**, **B**, **C**, **D**, **F**). |
| **Ask This Contract Q&A** | Semantic legal search with 1-click query chips (Cancellation terms, IP ownership, arbitration waivers, data rights). |
| **Counter-Clause Drafting** | Generates redline negotiation clauses and ready-to-send counterparty negotiation emails. |
| **Key Deadlines Timeline** | Detects arbitration opt-out deadlines, cancellation windows, and payment terms with 1-click Google Calendar & `.ics` export. |

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript 5, Vite 7, Tailwind CSS v4, Lucide React, Framer Motion
- **Internationalization (i18n)**: Typed context dictionary with persistent language preference
- **API & Serverless Layer**: Node.js serverless functions (`/api/analyses`, `/api/fetch-url`, `/api/rag-query`)
- **AI & Reasoning Models**: Multi-provider fallback engine supporting NVIDIA NIM , Google Gemini, and Groq, paired with a deterministic client-side heuristic legal rule engine.
- **Privacy & Sanitization**: Client-side regex PII mask engine.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** 18+ or 20+
- **npm**, **pnpm**, or **yarn**

### 2. Installation
```bash
git clone https://github.com/dhruvmkolhe/termsight-v2.git
cd termsight-v2
npm install
```

### 3. Environment Configuration
Copy the example environment template:
```bash
cp .env.example .env
```

Configure your preferred AI reasoning provider (or leave blank to automatically utilize the built-in deterministic heuristic rule engine):
```env
# Optional AI Key (NVIDIA, OpenAI, Anthropic, Gemini, or Groq)
NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b

# Optional Analytics
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# VITE_PLAUSIBLE_DOMAIN=termsight.app
```

### 4. Development Server
```bash
npm run dev
```
Access the application at [http://localhost:5173](http://localhost:5173).

### 5. Test Suite & Verification
```bash
npm test          # Run Vitest test suite
npm run lint      # Run ESLint validation
npm run build     # Compile production bundle
```

---

## 🔒 Privacy, Security & Ethics

- **Zero Data Retention**: Contracts and uploaded files are processed ephemerally in-memory and discarded.
- **Client-Side Redaction**: Sensitive personal details are scrubbed locally in your browser before API dispatch.
- **No Tracking Cookies**: Zero third-party advertising trackers or invasive behavioral tracking.

---

## ⚖️ Legal Disclaimer

TermSight provides automated informational summaries and clause risk ratings using heuristic algorithms and large language models. TermSight is **not a law firm** and does **not provide legal advice**. Using TermSight does not establish an attorney-client relationship. For binding commercial transactions or high-stakes disputes, always consult a qualified legal professional in your jurisdiction.

---

## 📬 Contact & Community

- **Support & Inquiries**: [hellotermsight@proton.me](mailto:hellotermsight@proton.me)
- **License**: [MIT](./LICENSE) © 2025-2026 TermSight Contributors
