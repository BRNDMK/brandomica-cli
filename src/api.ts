let apiBase = process.env.BRANDOMICA_API_URL || "https://www.brandomica.com";

export function setApiBase(url: string): void {
  apiBase = url;
}

export function getApiBase(): string {
  return apiBase;
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi(
  endpoint: string,
  name: string,
  extra?: Record<string, string>,
): Promise<unknown> {
  const params = new URLSearchParams({ name });
  if (extra) {
    for (const [k, v] of Object.entries(extra)) params.set(k, v);
  }
  const url = `${apiBase}/api/${endpoint}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, `API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function fetchApiPost(
  endpoint: string,
  body: unknown,
): Promise<unknown> {
  const url = `${apiBase}/api/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, `API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchApiRaw(
  endpoint: string,
  params?: Record<string, string>,
): Promise<unknown> {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  const url = `${apiBase}/api/${endpoint}${qs}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, `API error ${res.status}: ${body}`);
  }
  return res.json();
}

const BRAND_NAME_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export function validateName(input: string): string {
  const name = input.toLowerCase().trim();
  if (!BRAND_NAME_RE.test(name)) {
    console.error(
      `Error: Invalid brand name "${input}". Use lowercase letters, numbers, and hyphens (no leading/trailing hyphens, max 63 chars).`,
    );
    process.exit(1);
  }
  return name;
}
