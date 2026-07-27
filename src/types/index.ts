export type LeadStatus = 'NEW' | 'RESEARCHED' | 'CONTACT_FOUND' | 'OUTREACH_READY' | 'SENT' | 'ARCHIVED'

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  RESEARCHED: 'Researched',
  CONTACT_FOUND: 'Contact Found',
  OUTREACH_READY: 'Outreach Ready',
  SENT: 'Sent',
  ARCHIVED: 'Archived',
}

export const LEAD_STATUS_ORDER: LeadStatus[] = ['NEW', 'RESEARCHED', 'CONTACT_FOUND', 'OUTREACH_READY', 'SENT', 'ARCHIVED']

export interface LeadSummary {
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

export interface LeadDetail extends LeadSummary {
  researchRuns: ResearchRun[]
  painPoints: PainPoint[]
  decisionMakers: DecisionMaker[]
  outreachDrafts: OutreachDraft[]
  sentEmails: SentEmail[]
}

export interface ResearchRun {
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

export interface NewsItem {
  title: string
  snippet: string
  url: string
  date: string | null
  source: string | null
}

export interface JobPosting {
  title: string
  department: string | null
  location: string | null
  signals: string[]
  source: 'greenhouse' | 'lever' | 'serper_fallback'
}

export interface FundingInfo {
  lastRound: string | null
  amount: string | null
  date: string | null
  investors: string[]
}

export interface PainPoint {
  id: string
  leadId: string
  title: string
  description: string
  evidence: string
  urgency: 'high' | 'medium' | 'low'
  relevantSignal: string
  createdAt: string
}

export interface DecisionMaker {
  id: string
  leadId: string
  name: string | null
  title: string | null
  email: string | null
  emailConfidence: number | null
  linkedInUrl: string | null
  source: 'hunter' | 'apollo' | 'fallback'
  isPrimary: boolean
  createdAt: string
}

export interface OutreachDraft {
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

export interface SentEmail {
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

export interface User {
  id: string
  name: string
  company_name: string
  email: string
  title?: string
  is_verified?: boolean
  created_at?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface ApiListResponse<T> {
  data: T[]
}

export interface ApiSingleResponse<T> {
  data: T
}

export interface ApiResolveResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total?: number
  page?: number
  limit?: number
}

export type PackId = 'starter' | 'growth' | 'pro'

export interface CreditPack {
  id: PackId
  credits: number
  price: number
  label: string
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'starter', credits: 10, price: 4500, label: 'Starter' },
  { id: 'growth', credits: 50, price: 20000, label: 'Growth' },
  { id: 'pro', credits: 150, price: 52500, label: 'Pro' },
]

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'

export interface PaymentTransaction {
  paymentReference: string
  transactionReference: string | null
  userId: string
  packId: PackId
  amount: number
  status: PaymentStatus
  createdAt: string
  verifiedAt: string | null
}

export interface CreditLedgerEntry {
  id: string
  userId: string
  delta: number
  reason: string
  paymentReference: string | null
  createdAt: string
}

export interface PaymentInitiateResponse {
  checkoutUrl: string
  paymentReference: string
}

export interface PaymentStatusResponse {
  paymentReference: string
  status: PaymentStatus
  packId: PackId
  amount: number
  createdAt: string
  verifiedAt: string | null
  creditBalance: number
}

export interface CreditsResponse {
  credits: number
}

export interface InsufficientCreditsError {
  error: string
  balance: number
  needed: number
}
