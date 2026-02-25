import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchApi, fetchApiPost, fetchApiRaw, validateName, ApiError, setApiBase } from "../src/api.js";

describe("validateName", () => {
  it("accepts valid lowercase name", () => {
    expect(validateName("acme")).toBe("acme");
  });

  it("lowercases input", () => {
    expect(validateName("AcMe")).toBe("acme");
  });

  it("accepts name with hyphens", () => {
    expect(validateName("my-brand")).toBe("my-brand");
  });

  it("accepts name with numbers", () => {
    expect(validateName("brand123")).toBe("brand123");
  });

  it("rejects leading hyphen", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("exit");
    }) as never);
    const mockError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => validateName("-invalid")).toThrow("exit");
    expect(mockError).toHaveBeenCalledWith(expect.stringContaining("Invalid brand name"));
    mockExit.mockRestore();
    mockError.mockRestore();
  });

  it("rejects trailing hyphen", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("exit");
    }) as never);
    const mockError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => validateName("invalid-")).toThrow("exit");
    mockExit.mockRestore();
    mockError.mockRestore();
  });

  it("rejects names with spaces", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("exit");
    }) as never);
    const mockError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => validateName("my brand")).toThrow("exit");
    mockExit.mockRestore();
    mockError.mockRestore();
  });
});

describe("fetchApi", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setApiBase("https://test.example.com");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("calls correct URL with name param", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await fetchApi("check-domains", "acme");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://test.example.com/api/check-domains?name=acme",
    );
  });

  it("adds extra params", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    await fetchApi("check-all", "acme", { mode: "quick" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://test.example.com/api/check-all?name=acme&mode=quick",
    );
  });

  it("throws ApiError on non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve("Rate limited"),
    });
    await expect(fetchApi("check-domains", "acme")).rejects.toThrow(ApiError);
    await expect(fetchApi("check-domains", "acme")).rejects.toThrow("429");
  });
});

describe("fetchApiPost", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setApiBase("https://test.example.com");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("sends POST with JSON body", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await fetchApiPost("compare-brands", { names: ["a", "b"] });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://test.example.com/api/compare-brands",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: ["a", "b"] }),
      }),
    );
  });
});

describe("fetchApiRaw", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setApiBase("https://test.example.com");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("calls endpoint without params", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: "healthy" }),
    });
    await fetchApiRaw("health");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://test.example.com/api/health",
    );
  });

  it("calls endpoint with params", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    await fetchApiRaw("health", { verbose: "true" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://test.example.com/api/health?verbose=true",
    );
  });
});
