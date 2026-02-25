import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setPlain } from "../src/format/colors.js";
import { setApiBase } from "../src/api.js";
import type { CheckAllResponse, HealthResponse } from "../src/types.js";

// Mock data
const mockCheckAll: CheckAllResponse = {
  name: "testbrand",
  mode: "full",
  domains: [
    { domain: "testbrand.com", available: true, purchasePrice: 12, renewalPrice: 15 },
    { domain: "testbrand.io", available: false },
  ],
  social: [
    { platform: "GitHub", available: true, url: "https://github.com/testbrand" },
  ],
  trademarks: [
    { source: "USPTO", available: true, count: 0, url: "https://tsdr.uspto.gov", provider: "Turso" },
  ],
  appStores: [
    { platform: "iOS App Store", found: false },
  ],
  saas: [
    { platform: "npm", available: true, url: "https://npmjs.com/package/testbrand" },
  ],
  google: [
    { platform: "Google", found: false, url: "https://google.com/search?q=testbrand" },
  ],
  score: {
    score: 8,
    maxScore: 10,
    totalChecks: 19,
    confidence: "high",
    decisionGate: "ok",
    breakdown: [{ label: ".com avail" }],
  },
  safety: {
    overallRisk: "low",
    safetyScore: 85,
    headline: "Low Risk",
    summary: "Brand appears safe to use",
    blockers: [],
    unknownCriticalCategories: [],
    signals: [
      { id: "legal", label: "Legal", risk: "low", summary: "Clear", evidenceCount: 0, critical: false },
    ],
    actions: ["Register key domains"],
  },
};

const mockHealth: HealthResponse = {
  status: "healthy",
  components: [
    { id: "domains", status: "pass", latencyMs: 120 },
    { id: "social.github", status: "pass", latencyMs: 85 },
    { id: "trademarks.euipo", status: "limited" },
  ],
  summary: "All systems operational",
  timestamp: "2026-02-22T12:00:00Z",
};

beforeEach(() => {
  setPlain(true);
  setApiBase("https://test.example.com");
});

describe("check command output", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("produces formatted output with all sections", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCheckAll),
    });

    const output: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => output.push(args.join(" "));

    // Dynamically import to use mocked fetch
    const { registerCheckCommand } = await import("../src/commands/check.js");
    const { Command } = await import("commander");
    const program = new Command();
    program.option("--json").option("--plain");
    registerCheckCommand(program);
    await program.parseAsync(["node", "test", "check", "testbrand", "--plain"]);

    console.log = origLog;
    const fullOutput = output.join("\n");

    expect(fullOutput).toContain("Availability Score");
    expect(fullOutput).toContain("8/10");
    expect(fullOutput).toContain("Brand Safety Assessment");
    expect(fullOutput).toContain("Domains");
    expect(fullOutput).toContain("Social Handles");
    expect(fullOutput).toContain("Trademarks");
  });

  it("produces valid JSON with --json flag", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCheckAll),
    });

    const output: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => output.push(args.join(" "));

    const { registerCheckCommand } = await import("../src/commands/check.js");
    const { Command } = await import("commander");
    const program = new Command();
    program.option("--json").option("--plain");
    registerCheckCommand(program);
    await program.parseAsync(["node", "test", "check", "testbrand", "--json"]);

    console.log = origLog;
    const parsed = JSON.parse(output.join(""));
    expect(parsed.name).toBe("testbrand");
    expect(parsed.score.score).toBe(8);
  });
});

describe("health command output", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("shows component status", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHealth),
    });

    const output: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => output.push(args.join(" "));

    const { registerHealthCommand } = await import("../src/commands/health.js");
    const { Command } = await import("commander");
    const program = new Command();
    program.option("--json").option("--plain");
    registerHealthCommand(program);
    await program.parseAsync(["node", "test", "health", "--plain"]);

    console.log = origLog;
    const fullOutput = output.join("\n");

    expect(fullOutput).toContain("API Health");
    expect(fullOutput).toContain("healthy");
    expect(fullOutput).toContain("domains");
    expect(fullOutput).toContain("pass");
    expect(fullOutput).toContain("trademarks.euipo");
    expect(fullOutput).toContain("limited");
  });
});
