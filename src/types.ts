export interface DomainResult {
  domain: string;
  available: boolean;
  purchasePrice?: number;
  renewalPrice?: number;
  minimumRegistrationYears?: number;
  provider?: string;
}

export interface SocialResult {
  platform: string;
  available: boolean | null;
  url: string;
  method?: "api" | "index" | "manual";
  provider?: string;
}

export interface TrademarkResult {
  source: string;
  available: boolean | null;
  count: number;
  url: string;
  method?: string;
  provider?: string;
}

export interface AppStoreResult {
  platform: string;
  found: boolean | null;
  results?: string[];
  url?: string;
}

export interface SaasResult {
  platform: string;
  available: boolean | null;
  url: string;
}

export interface GoogleTopResult {
  title: string;
  url: string;
  snippet?: string;
}

export interface GoogleSearchResult {
  platform: string;
  found: boolean | null;
  resultCount?: number;
  topResults?: GoogleTopResult[];
  hasKnowledgeGraph?: boolean;
  provider?: string;
  url: string;
}

export interface ScoreResult {
  score: number;
  maxScore: number;
  totalChecks: number;
  confidence: "high" | "medium" | "low";
  decisionGate: "ok" | "insufficient_evidence";
  confidenceNote?: string;
  missingCriticalCategories?: string[];
  breakdown: { label: string }[];
}

export interface SafetySignal {
  id: "legal" | "collision" | "impersonation" | "linguistic" | "phonetic" | "coverage";
  label: string;
  risk: "low" | "medium" | "high";
  summary: string;
  evidenceCount: number;
  critical: boolean;
}

export interface BrandSafetyAssessment {
  overallRisk: "low" | "medium" | "high";
  safetyScore: number;
  headline: string;
  summary: string;
  blockers: string[];
  unknownCriticalCategories: string[];
  signals: SafetySignal[];
  actions: string[];
}

export interface LinguisticResult {
  profanityMatches: Array<{ word: string; language: string; severity: number }>;
  meanings: Array<{ word: string; language: string; definition: string }>;
}

export interface PhoneticResult {
  encoding: string;
  conflicts: Array<{ word: string; distance: number; trademark?: boolean }>;
  similarWords: string[];
}

export interface CheckAllResponse {
  name: string;
  domains: DomainResult[];
  social: SocialResult[];
  trademarks: TrademarkResult[];
  appStores: AppStoreResult[];
  saas: SaasResult[];
  google: GoogleSearchResult[];
  score: ScoreResult;
  safety: BrandSafetyAssessment;
  linguistic?: LinguisticResult;
  phonetic?: PhoneticResult;
  mode: string;
}

export interface CompareResponse {
  results: CheckAllResponse[];
  recommendation: string | null;
}

export interface BatchCheckResponse {
  results: CheckAllResponse[];
  mode: string;
  count: number;
}

export interface FilingReadinessConflictSummary {
  severity: "high" | "medium" | "low";
  source: string;
  jurisdiction?: string;
  description: string;
  whyItMatters: string;
  evidenceUrl?: string;
  classes?: number[];
}

export interface FilingReadinessSummary {
  verdict: "ready" | "caution" | "blocked";
  filingRisk: "go" | "caution" | "stop";
  gateStatus: "ready" | "caution" | "blocked";
  confidence: "high" | "medium" | "low";
  missingCriticalCategories: string[];
  topConflicts: FilingReadinessConflictSummary[];
  actions: string[];
}

export interface FilingReadinessResponse {
  name: string;
  mode: "full" | "quick";
  checkedAt: string;
  filingReadiness: FilingReadinessSummary;
}

export interface BrandReport {
  brandName: string;
  generatedAt: string;
  sourceUrl: string;
  mode: string;
  availabilityScore: ScoreResult;
  safetyAssessment: BrandSafetyAssessment;
  filingReadiness: FilingReadinessSummary;
  domains: DomainResult[];
  social: SocialResult[];
  trademarks: TrademarkResult[];
  google: GoogleSearchResult[];
  appStores: AppStoreResult[];
  saas: SaasResult[];
  linguistic?: LinguisticResult;
  phonetic?: PhoneticResult;
  trademarkFilingEstimates: {
    uspto: { perClass: number; note: string };
    euipo: { perClass: number; note: string };
  };
  limitations: string[];
  checksCompleted: number;
  checksTotal: number;
}

export interface HealthComponent {
  id: string;
  status: "pass" | "limited" | "warn" | "fail";
  latencyMs?: number;
  error?: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  components: HealthComponent[];
  summary: string;
  timestamp: string;
}
