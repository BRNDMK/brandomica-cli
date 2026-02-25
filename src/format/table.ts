import type {
  DomainResult,
  SocialResult,
  TrademarkResult,
  AppStoreResult,
  SaasResult,
  GoogleSearchResult,
} from "../types.js";
import {
  green,
  red,
  yellow,
  dim,
  bold,
  availabilitySymbol,
  SYM,
} from "./colors.js";

function padEnd(s: string, len: number): string {
  const stripped = s.replace(/\x1B\[[0-9;]*m/g, "");
  const pad = Math.max(0, len - stripped.length);
  return s + " ".repeat(pad);
}

export function formatDomainsTable(domains: DomainResult[]): string {
  const lines: string[] = [bold("Domains")];
  for (const d of domains) {
    const sym = availabilitySymbol(d.available);
    const name = padEnd(d.domain, 20);
    if (d.available) {
      let price = "";
      if (d.purchasePrice != null && d.renewalPrice != null) {
        const minYears = d.minimumRegistrationYears ?? 1;
        const dueToday =
          d.purchasePrice + d.renewalPrice * Math.max(0, minYears - 1);
        const tco3 = d.purchasePrice + d.renewalPrice * 2;
        price = dim(
          `  $${d.purchasePrice}/yr1  $${d.renewalPrice}/renew  $${tco3}/3Y`,
        );
        if (minYears > 1) {
          price += yellow(` (${minYears}y min, $${dueToday} due)`);
        }
      }
      const fallback = d.provider === "WhoisXML" ? dim(" [WhoisXML]") : "";
      lines.push(`  ${sym} ${green(name)}${price}${fallback}`);
    } else {
      lines.push(`  ${sym} ${red(name)}${dim("  taken")}`);
    }
  }
  return lines.join("\n");
}

export function formatSocialTable(social: SocialResult[]): string {
  const lines: string[] = [bold("Social Handles")];
  for (const s of social) {
    const sym = availabilitySymbol(s.available);
    const name = padEnd(s.platform, 16);
    const status =
      s.available === true
        ? green("available")
        : s.available === false
          ? red("taken")
          : yellow("check manually");
    lines.push(`  ${sym} ${name} ${status}  ${dim(s.url)}`);
  }
  return lines.join("\n");
}

export function formatTrademarksTable(trademarks: TrademarkResult[]): string {
  const lines: string[] = [bold("Trademarks")];
  for (const t of trademarks) {
    const sym = availabilitySymbol(t.available);
    const name = padEnd(t.source, 12);
    const status =
      t.available === true
        ? green("clear")
        : t.available === false
          ? red(`${t.count} conflicts`)
          : yellow("check manually");
    const via = t.provider ? dim(` [${t.provider}]`) : "";
    lines.push(`  ${sym} ${name} ${status}${via}  ${dim(t.url)}`);
  }
  return lines.join("\n");
}

export function formatAppStoresTable(appStores: AppStoreResult[]): string {
  const lines: string[] = [bold("App Stores")];
  for (const a of appStores) {
    const sym =
      a.found === true ? SYM.fail : a.found === false ? SYM.ok : SYM.warn;
    const name = padEnd(a.platform, 16);
    const status =
      a.found === true
        ? red(`found (${a.results?.join(", ") || "matches"})`)
        : a.found === false
          ? green("clear")
          : yellow("check manually");
    const url = a.url ? dim(`  ${a.url}`) : "";
    lines.push(`  ${sym} ${name} ${status}${url}`);
  }
  return lines.join("\n");
}

export function formatSaasTable(saas: SaasResult[]): string {
  const lines: string[] = [bold("Package Registries & SaaS")];
  for (const s of saas) {
    const sym = availabilitySymbol(s.available);
    const name = padEnd(s.platform, 16);
    const status =
      s.available === true
        ? green("available")
        : s.available === false
          ? red("taken")
          : yellow("check manually");
    lines.push(`  ${sym} ${name} ${status}  ${dim(s.url)}`);
  }
  return lines.join("\n");
}

export function formatGoogleTable(google: GoogleSearchResult[]): string {
  const lines: string[] = [bold("Web Presence (Google)")];
  for (const g of google) {
    const sym =
      g.found === true ? SYM.fail : g.found === false ? SYM.ok : SYM.warn;
    const name = padEnd(g.platform, 16);
    const status =
      g.found === true
        ? red(
            `competitors found${g.resultCount ? ` (${g.resultCount})` : ""}`,
          )
        : g.found === false
          ? green("no competitors")
          : yellow("check manually");
    const kg = g.hasKnowledgeGraph ? yellow(" [Knowledge Graph]") : "";
    lines.push(`  ${sym} ${name} ${status}${kg}`);
    if (g.found === true && g.topResults?.length) {
      for (const r of g.topResults.slice(0, 3)) {
        lines.push(`      ${dim("\u2192")} ${dim(r.title)}`);
      }
    }
  }
  return lines.join("\n");
}
