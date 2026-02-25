import { describe, it, expect, beforeEach } from "vitest";
import { setPlain } from "../src/format/colors.js";
import { formatDomainsTable, formatSocialTable, formatTrademarksTable, formatAppStoresTable, formatSaasTable, formatGoogleTable } from "../src/format/table.js";
import { formatScoreCard, formatSafetyCard } from "../src/format/score.js";
import type { DomainResult, SocialResult, TrademarkResult, AppStoreResult, SaasResult, GoogleSearchResult, ScoreResult, BrandSafetyAssessment } from "../src/types.js";

beforeEach(() => {
  setPlain(true);
});

describe("formatDomainsTable", () => {
  it("shows available domains with pricing", () => {
    const domains: DomainResult[] = [
      { domain: "acme.com", available: true, purchasePrice: 12, renewalPrice: 15 },
      { domain: "acme.io", available: false },
    ];
    const result = formatDomainsTable(domains);
    expect(result).toContain("Domains");
    expect(result).toContain("acme.com");
    expect(result).toContain("$12/yr1");
    expect(result).toContain("$15/renew");
    expect(result).toContain("acme.io");
    expect(result).toContain("taken");
  });

  it("shows minimum registration years", () => {
    const domains: DomainResult[] = [
      { domain: "acme.ai", available: true, purchasePrice: 50, renewalPrice: 50, minimumRegistrationYears: 2 },
    ];
    const result = formatDomainsTable(domains);
    expect(result).toContain("2y min");
    expect(result).toContain("$100 due");
  });

  it("shows WhoisXML fallback", () => {
    const domains: DomainResult[] = [
      { domain: "acme.co", available: true, provider: "WhoisXML" },
    ];
    const result = formatDomainsTable(domains);
    expect(result).toContain("[WhoisXML]");
  });
});

describe("formatSocialTable", () => {
  it("shows platform availability", () => {
    const social: SocialResult[] = [
      { platform: "GitHub", available: true, url: "https://github.com/acme" },
      { platform: "Twitter/X", available: false, url: "https://x.com/acme" },
      { platform: "TikTok", available: null, url: "https://tiktok.com/@acme" },
    ];
    const result = formatSocialTable(social);
    expect(result).toContain("Social Handles");
    expect(result).toContain("available");
    expect(result).toContain("taken");
    expect(result).toContain("check manually");
  });
});

describe("formatTrademarksTable", () => {
  it("shows trademark conflicts", () => {
    const trademarks: TrademarkResult[] = [
      { source: "USPTO", available: false, count: 3, url: "https://tsdr.uspto.gov", provider: "Turso" },
      { source: "EUIPO", available: null, count: 0, url: "https://euipo.europa.eu" },
    ];
    const result = formatTrademarksTable(trademarks);
    expect(result).toContain("Trademarks");
    expect(result).toContain("3 conflicts");
    expect(result).toContain("[Turso]");
    expect(result).toContain("check manually");
  });
});

describe("formatAppStoresTable", () => {
  it("shows found/clear/unknown", () => {
    const appStores: AppStoreResult[] = [
      { platform: "iOS App Store", found: true, results: ["Acme App"] },
      { platform: "Google Play", found: null, url: "https://play.google.com" },
    ];
    const result = formatAppStoresTable(appStores);
    expect(result).toContain("App Stores");
    expect(result).toContain("found");
    expect(result).toContain("Acme App");
    expect(result).toContain("check manually");
  });
});

describe("formatSaasTable", () => {
  it("shows platform status", () => {
    const saas: SaasResult[] = [
      { platform: "npm", available: false, url: "https://npmjs.com/package/acme" },
      { platform: "PyPI", available: true, url: "https://pypi.org/project/acme" },
    ];
    const result = formatSaasTable(saas);
    expect(result).toContain("Package Registries & SaaS");
    expect(result).toContain("taken");
    expect(result).toContain("available");
  });
});

describe("formatGoogleTable", () => {
  it("shows competitor results", () => {
    const google: GoogleSearchResult[] = [
      {
        platform: "Google",
        found: true,
        resultCount: 1200,
        topResults: [{ title: "ACME Corp", url: "https://acme.com" }],
        hasKnowledgeGraph: true,
        url: "https://google.com/search?q=acme",
      },
    ];
    const result = formatGoogleTable(google);
    expect(result).toContain("Web Presence (Google)");
    expect(result).toContain("competitors found");
    expect(result).toContain("1200");
    expect(result).toContain("[Knowledge Graph]");
    expect(result).toContain("ACME Corp");
  });
});

describe("formatScoreCard", () => {
  it("renders score with confidence", () => {
    const score: ScoreResult = {
      score: 7,
      maxScore: 10,
      totalChecks: 19,
      confidence: "high",
      decisionGate: "ok",
      breakdown: [{ label: ".com avail" }, { label: "GitHub avail" }],
    };
    const result = formatScoreCard(score);
    expect(result).toContain("Availability Score");
    expect(result).toContain("7/10");
    expect(result).toContain("high confidence");
    expect(result).toContain("19 checks");
    expect(result).toContain(".com avail");
  });

  it("shows low confidence warning", () => {
    const score: ScoreResult = {
      score: 5,
      maxScore: 10,
      totalChecks: 19,
      confidence: "low",
      decisionGate: "insufficient_evidence",
      missingCriticalCategories: ["domains", "trademarks"],
      breakdown: [],
    };
    const result = formatScoreCard(score);
    expect(result).toContain("Low confidence");
    expect(result).toContain("domains, trademarks");
  });
});

describe("formatSafetyCard", () => {
  it("renders safety assessment", () => {
    const safety: BrandSafetyAssessment = {
      overallRisk: "high",
      safetyScore: 25,
      headline: "High Risk",
      summary: "Multiple conflicts detected",
      blockers: ["Active trademark registrations"],
      unknownCriticalCategories: [],
      signals: [
        { id: "legal", label: "Legal", risk: "high", summary: "3 USPTO conflicts", evidenceCount: 3, critical: true },
        { id: "collision", label: "Collision", risk: "low", summary: "No collisions", evidenceCount: 0, critical: false },
      ],
      actions: ["Consult trademark attorney"],
    };
    const result = formatSafetyCard(safety);
    expect(result).toContain("Brand Safety Assessment");
    expect(result).toContain("25/100");
    expect(result).toContain("High Risk");
    expect(result).toContain("[CRITICAL]");
    expect(result).toContain("Blockers");
    expect(result).toContain("Active trademark registrations");
    expect(result).toContain("Consult trademark attorney");
  });

  it("omits blockers section when empty", () => {
    const safety: BrandSafetyAssessment = {
      overallRisk: "low",
      safetyScore: 90,
      headline: "Low Risk",
      summary: "Brand name appears safe",
      blockers: [],
      unknownCriticalCategories: [],
      signals: [],
      actions: [],
    };
    const result = formatSafetyCard(safety);
    expect(result).not.toContain("Blockers");
  });
});
