# Frontend Implementation Guide

## Overview

This is a lead-generation SDR tool. Users create leads (target companies), then run a 5-step research pipeline on each one to produce personalized outreach copy and send it. The backend is a REST API at `http://localhost:4000`.

---

## Auth & API Client Setup

### Base URL

```
http://localhost:4000
```

### Auth flow

1. `POST /auth/register` — creates account, sends OTP email
2. `POST /auth/verify-email` — verify with 6-digit OTP, returns tokens
3. `POST /auth/login` — returns `access_token`, `refresh_token`, `user`
4. Store tokens (localStorage/session). Attach `Authorization: Bearer <access_token>` to all `/api/*` requests.
5. When access token expires (15min), use `POST /auth/refresh-token` to rotate.
6. `POST /auth/logout` — revokes refresh token.

### API client structure

Create an API client that:
- Sets `Authorization: Bearer <token>` on every request
- On 401, tries token refresh, then retries the original request
- On refresh failure, redirects to login

---

## Core Pages

### 1. Auth pages (no auth required)

| Page | Route | Purpose |
|---|---|---|
| Register | `/register` | Name, company name, email, password |
| Verify Email | `/verify-email?user_id=xxx` | 6-digit OTP input |
| Login | `/login` | Email + password |
| Forgot Password | `/forgot-password` | Email input |
| Reset Password | `/reset-password` | OTP + new password |

**Required endpoints:**
- `POST /auth/register` — body: `{ name, company_name, email, password }`
- `POST /auth/verify-email` — body: `{ user_id, otp }`
- `POST /auth/resend-otp` — body: `{ email, type: "email_verification" | "password_reset" }`
- `POST /auth/login` — body: `{ email, password }`
- `POST /auth/forgot-password` — body: `{ email }`
- `POST /auth/reset-password` — body: `{ email, otp, new_password }`

### 2. Dashboard / Lead List (auth required)

| Page | Route | Purpose |
|---|---|---|
| Lead List | `/` or `/leads` | Table/cards of all leads with child counts |
| Create Lead | (modal or `/leads/new`) | Form to add a company |

**Required endpoints:**
- `GET /api/leads` — returns `{ data: [{ id, company, domain, targetRole, status, notes, createdAt, _count: { researchRuns, painPoints, decisionMakers, outreachDrafts } }] }`
- `POST /api/leads` — body: `{ company, domain, targetRole?, notes? }`
- `DELETE /api/leads/:leadId` — no body

### 3. Lead Detail / Pipeline Workspace (auth required)

| Page | Route | Purpose |
|---|---|---|
| Lead Detail | `/leads/:leadId` | Full lead workspace with pipeline stages |

This is the main workspace. It has 4 pipeline sections:

**Pipeline section 1 — Research**
- View research run history (list of past runs)
- "Resolve Research" button to auto-run `research_company` tool
- Manual research entry form (for pasting existing data)

**Pipeline section 2 — Pain Points**
- View pain point history
- "Resolve Pain Points" button to auto-analyze with AI
- Manual pain point entry form

**Pipeline section 3 — Decision Makers**
- View decision maker history (primary shown first)
- "Resolve Decision Maker" button to auto-find contact
- Manual decision maker entry form

**Pipeline section 4 — Outreach**
- View outreach draft history (email + LinkedIn)
- "Resolve Outreach" button to auto-generate copy
- Manual outreach draft entry form

**Pipeline section 5 — Send Outreach**
- View sent email history (SendByte email IDs)
- "Send Email" button to actually send the drafted email
- Show send status (success/failure with error details)
- Requires SENDBYTE_API_KEY configured in backend environment

**Required endpoints:**

| Endpoint | When to call |
|---|---|
| `GET /api/leads/:leadId` | Page load — gets lead + all children nested |
| `GET /api/leads/:leadId/research-runs` | Lazy-load research history |
| `GET /api/leads/:leadId/pain-points` | Lazy-load pain point history |
| `GET /api/leads/:leadId/decision-makers` | Lazy-load decision maker history |
| `GET /api/leads/:leadId/outreach-drafts` | Lazy-load outreach history |
| `PATCH /api/leads/:leadId` | Update lead fields (notes, status, targetRole) |
| `POST /api/leads/:leadId/resolve-research` | Auto-research button |
| `POST /api/leads/:leadId/resolve-pain-points` | Auto-analyze pain points button |
| `POST /api/leads/:leadId/resolve-decision-maker` | Auto-find decision maker button |
| `POST /api/leads/:leadId/resolve-outreach` | Auto-generate outreach button |
| `POST /api/leads/:leadId/send-outreach` | Send the drafted email via SendByte (requires an outreach draft) |
| `POST /api/leads/:leadId/research-runs` | Manual research save |
| `POST /api/leads/:leadId/pain-points` | Manual pain points save |
| `POST /api/leads/:leadId/decision-makers` | Manual decision maker save |
| `POST /api/leads/:leadId/outreach-drafts` | Manual outreach save |

### 4. Settings / Profile (auth required)

| Page | Route | Purpose |
|---|---|---|
| Profile | `/settings` or `/profile` | View/update name, company_name |

**Required endpoints:**
- `GET /auth/me` — returns `{ id, name, company_name, email, is_verified, created_at }`
- `PATCH /auth/me` — body: `{ name?, company_name? }`

---

## The 5-Step Pipeline (Orchestration)

The core workflow is sequential. Each "resolve" endpoint calls a Lua AI tool and stores the result:

```
  Create Lead
       |
  Resolve Research ────────>  GET /api/leads/:leadId/research-runs
       |
  Resolve Pain Points ─────>  GET /api/leads/:leadId/pain-points
       |
  Resolve Decision Maker ──>  GET /api/leads/:leadId/decision-makers
       |
  Resolve Outreach ────────>  GET /api/leads/:leadId/outreach-drafts
       |
  Send Outreach ───────────>  POST /api/leads/:leadId/send-outreach
```

**Frontend orchestration pattern:**

Each pipeline step has two modes:

**A) "Resolve" mode (auto with AI):**
- Button triggers POST `/:leadId/resolve-{step}`
- Backend runs the Lua AI tool, saves result, advances lead status
- Response includes `data` (the saved record) and `meta` (raw tool output)
- Show loading state — these take 10–30 seconds
- On success, refresh the history for that section

**B) "Manual" mode (user provides data):**
- Form submits POST `/:leadId/{step}`
- Backend saves it directly
- On success, refresh the history for that section

**Status advancement (automatic — no frontend action needed):**

| Action | Lead status becomes |
|---|---|
| Lead created | `NEW` |
| Research saved/resolved | `RESEARCHED` |
| Pain points saved | `RESEARCHED` (no change) |
| Decision maker saved/resolved | `CONTACT_FOUND` |
| Outreach saved/resolved | `OUTREACH_READY` |
| Email sent via SendByte | `SENT` |
| PATCH with status | Whatever you set |

---

## Component Architecture

### Suggested component tree

```
App
├── AuthProvider (context — stores tokens, user, login/logout)
│
├── GuestLayout (login/register pages, no sidebar)
│   ├── LoginPage
│   ├── RegisterPage
│   ├── VerifyEmailPage
│   ├── ForgotPasswordPage
│   └── ResetPasswordPage
│
└── AuthenticatedLayout (sidebar + header)
    ├── DashboardPage
    │   └── LeadTable
    │       └── LeadRow (company, status badge, child counts, actions)
    │
    ├── LeadDetailPage
    │   ├── LeadHeader (company name, domain, targetRole, status badge, notes)
    │   ├── LeadActions (edit, delete)
    │   │
    │   ├── PipelineStage (Research)
    │   │   ├── ResolveButton ("Research Company" — loading, spinner)
    │   │   ├── HistoryList
    │   │   │   └── ResearchRunCard (summary, industry, tech stack, news, job postings)
    │   │   └── ManualEntryForm
    │   │
    │   ├── PipelineStage (Pain Points)
    │   │   ├── ResolveButton ("Analyze Pain Points" — needs research first)
    │   │   ├── HistoryList
    │   │   │   └── PainPointCard (title, urgency badge, description, evidence)
    │   │   └── ManualEntryForm
    │   │
    │   ├── PipelineStage (Decision Makers)
    │   │   ├── ResolveButton ("Find Decision Maker")
    │   │   ├── HistoryList
    │   │   │   └── DecisionMakerCard (name, title, email, LinkedIn, source, primary badge)
    │   │   └── ManualEntryForm
    │   │
    │   ├── PipelineStage (Outreach)
    │   │   ├── ResolveButton ("Generate Outreach" — needs research + pain points)
    │   │   ├── HistoryList
    │   │   │   └── OutreachDraftCard (email preview, LinkedIn preview, score)
    │   │   └── ManualEntryForm
    │   │
    │   ├── PipelineStage (Send Outreach)
    │   │   ├── SendButton ("Send Email" — needs outreach draft)
    │   │   ├── HistoryList
    │   │   │   └── SentEmailCard (SendByte email ID, status, error details)
    │   │   └── SendStatus (shows success/failure after send attempt)
    │   │
    │   └── SettingsPage
    │       └── ProfileForm (name, company_name)
```

---

## Status Flow Visualization

Lead statuses form a progression. Show them as steps:

```
NEW  ──>  RESEARCHED  ──>  CONTACT_FOUND  ──>  OUTREACH_READY  ──>  SENT
                                                       │
                                                       └── ARCHIVED
```

Each status maps to a pipeline section being completed. Use badges/stepper to show current stage and what's next.

---

## API Response Patterns

### Success

```ts
// List endpoints
{ data: T[] }

// Single resource
{ data: T }

// Resolve endpoints (include tool metadata)
{ data: T, meta: { toolOutput?: ..., overallContext?: ..., lookupInput?: ... } }

// Auth endpoints
{ access_token: string, refresh_token: string, user: { id, name, company_name, email } }

// Delete
{ message: string }
```

### Error

```ts
// Validation errors
{ error: "Validation failed", details: { field: ["error message"] } }

// API errors
{ error: "Lead not found" }
```

Status codes:
- `200` — success
- `201` — created
- `400` — bad request / validation
- `401` — unauthenticated (try token refresh)
- `403` — email not verified
- `404` — not found
- `409` — conflict (email already registered)

---

## Lead Status Enum (for badges/dropdowns)

```ts
type LeadStatus = "NEW" | "RESEARCHED" | "CONTACT_FOUND" | "OUTREACH_READY" | "SENT" | "ARCHIVED"
```

Map to display labels:
- `NEW` → "New"
- `RESEARCHED` → "Researched"
- `CONTACT_FOUND` → "Contact Found"
- `OUTREACH_READY` → "Outreach Ready"
- `SENT` → "Sent"
- `ARCHIVED` → "Archived"

---

## Types for Frontend

```ts
// From GET /api/leads
interface LeadSummary {
  id: string
  company: string
  domain: string | null
  targetRole: string | null
  notes: string | null
  status: LeadStatus
  createdAt: string
  _count: {
    researchRuns: number
    painPoints: number
    decisionMakers: number
    outreachDrafts: number
    sentEmails: number
  }
}

// From GET /api/leads/:leadId
interface LeadDetail extends LeadSummary {
  researchRuns: ResearchRun[]
  painPoints: PainPoint[]
  decisionMakers: DecisionMaker[]
  outreachDrafts: OutreachDraft[]
  sentEmails: SentEmail[]
}

interface SentEmail {
  id: string
  leadId: string
  outreachDraftId: string | null
  sendbyteEmailId: string
  to: string
  subject: string
  sentAt: string
  success: boolean
  error?: {
    code: string
    message: string
  }
}

interface ResearchRun {
  id: string
  leadId: string
  summary: string
  website: string | null
  linkedInUrl: string | null
  industry: string | null
  employeeCount: string | null
  fetchedAt: string
  recentNews: NewsItem[]
  jobPostings: JobPosting[]
  fundingInfo: FundingInfo | null
  techStack: string[]
  rawResearch: Record<string, unknown> | null
  createdAt: string
}

interface NewsItem {
  title: string
  snippet: string
  url: string
  date: string | null
  source: string | null
}

interface JobPosting {
  title: string
  department: string | null
  location: string | null
  signals: string[]
  source: "greenhouse" | "lever" | "serper_fallback"
}

interface FundingInfo {
  lastRound: string | null
  amount: string | null
  date: string | null
  investors: string[]
}

interface PainPoint {
  id: string
  leadId: string
  title: string
  description: string
  evidence: string
  urgency: "high" | "medium" | "low"
  relevantSignal: string
  createdAt: string
}

interface DecisionMaker {
  id: string
  leadId: string
  name: string | null
  title: string | null
  email: string | null
  emailConfidence: number | null
  linkedInUrl: string | null
  source: "hunter" | "apollo" | "fallback"
  isPrimary: boolean
  createdAt: string
}

interface OutreachDraft {
  id: string
  leadId: string
  decisionMakerId: string | null
  emailSubject: string | null
  emailBody: string
  emailWordCount: number
  linkedinBody: string
  linkedinWordCount: number
  validationScore: number
  validationNotes: string
  wasRewritten: boolean
  generatedAt: string
  createdAt: string
}
```

---

## Local Development

```bash
# Backend runs on port 4000
npm run backend:dev

# Frontend dev server (separate project, port 5173)
npm run dev
```

The CORS origin is already set to `http://localhost:5173` in the backend.

---

## Complete Route Reference

### Auth (`/auth`) — no auth required

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/register` | `{ name, company_name, email, password }` | `{ message, user_id }` |
| POST | `/auth/verify-email` | `{ user_id, otp }` | `{ access_token, refresh_token, user }` |
| POST | `/auth/resend-otp` | `{ email, type }` | `{ message }` |
| POST | `/auth/login` | `{ email, password }` | `{ access_token, refresh_token, user }` |
| POST | `/auth/refresh-token` | `{ refresh_token }` | `{ access_token, refresh_token }` |
| POST | `/auth/forgot-password` | `{ email }` | `{ message }` |
| POST | `/auth/reset-password` | `{ email, otp, new_password }` | `{ message }` |

### Auth (`/auth`) — auth required

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/auth/me` | — | `{ id, name, company_name, email, is_verified, created_at }` |
| PATCH | `/auth/me` | `{ name?, company_name? }` | `{ id, name, company_name, email, is_verified }` |
| POST | `/auth/logout` | `{ refresh_token }` | `{ message }` |

### Leads (`/api/leads`) — auth required

| Method | Path | Body / Notes |
|---|---|---|
| GET | `/api/leads` | Returns leads with `_count` of children (includes sentEmails) |
| POST | `/api/leads` | `{ company, domain, targetRole?, notes? }` |
| GET | `/api/leads/:leadId` | Returns lead with all children nested |
| PATCH | `/api/leads/:leadId` | `{ company?, domain?, targetRole?, notes?, status? }` |
| DELETE | `/api/leads/:leadId` | Cascades to children |
| GET | `/api/leads/:leadId/research-runs` | Research history |
| POST | `/api/leads/:leadId/research-runs` | Manual research save |
| POST | `/api/leads/:leadId/resolve-research` | Auto-research via AI |
| GET | `/api/leads/:leadId/pain-points` | Pain point history |
| POST | `/api/leads/:leadId/pain-points` | `{ items: [{ title, description, evidence, urgency, relevantSignal }] }` |
| POST | `/api/leads/:leadId/resolve-pain-points` | `{ ourProduct? }` — requires research first |
| GET | `/api/leads/:leadId/decision-makers` | Decision maker history (primary first) |
| POST | `/api/leads/:leadId/decision-makers` | `{ name?, title?, email?, emailConfidence?, linkedInUrl?, source, isPrimary? }` |
| POST | `/api/leads/:leadId/resolve-decision-maker` | `{ companyDomain?, targetRole?, isPrimary? }` |
| GET | `/api/leads/:leadId/outreach-drafts` | Outreach history |
| POST | `/api/leads/:leadId/outreach-drafts` | Manual outreach save |
| POST | `/api/leads/:leadId/resolve-outreach` | `{ decisionMakerId?, senderName?, senderCompany?, ourProduct?, tone? }` — requires research + pain points |
| POST | `/api/leads/:leadId/send-outreach` | `{ outreachDraftId, from }` — sends email via SendByte, returns `{ success, emailId?, error? }` |

### Health — no auth required

| Method | Path | Response |
|---|---|---|
| GET | `/health` | `{ status, service, timestamp }` |
| GET | `/` | `{ service, version, docs }` |
