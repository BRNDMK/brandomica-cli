import { bold, dim } from "./colors.js";
import { formatDomainsTable, formatSocialTable, formatTrademarksTable, formatAppStoresTable, formatSaasTable, formatGoogleTable, } from "./table.js";
import { formatScoreCard, formatSafetyCard } from "./score.js";
export function formatReport(report) {
    const lines = [];
    lines.push(bold("\u2550".repeat(60)));
    lines.push(bold(`BRAND SAFETY REPORT \u2014 ${report.brandName.toUpperCase()}`));
    lines.push(bold("\u2550".repeat(60)));
    lines.push("");
    lines.push(dim(`Generated: ${report.generatedAt}`));
    lines.push(dim(`Source: ${report.sourceUrl}`));
    lines.push(dim(`Mode: ${report.mode}`));
    lines.push("");
    lines.push(formatScoreCard(report.availabilityScore));
    lines.push("");
    lines.push(formatSafetyCard(report.safetyAssessment));
    lines.push("");
    lines.push(bold("Filing Readiness"));
    const fr = report.filingReadiness;
    lines.push(`  Verdict: ${fr.verdict.toUpperCase()} (risk: ${fr.filingRisk})`);
    lines.push(`  Confidence: ${fr.confidence}`);
    if (fr.topConflicts.length > 0) {
        lines.push("  Top Conflicts:");
        for (const c of fr.topConflicts) {
            lines.push(`    ${dim("\u2192")} [${c.severity}] ${c.source}: ${c.description}`);
        }
    }
    if (fr.actions.length > 0) {
        lines.push("  Actions:");
        for (const a of fr.actions) {
            lines.push(`    ${dim("\u2022")} ${a}`);
        }
    }
    lines.push("");
    lines.push(formatDomainsTable(report.domains));
    lines.push("");
    lines.push(formatSocialTable(report.social));
    lines.push("");
    lines.push(formatTrademarksTable(report.trademarks));
    lines.push("");
    lines.push(formatGoogleTable(report.google));
    lines.push("");
    lines.push(formatAppStoresTable(report.appStores));
    lines.push("");
    lines.push(formatSaasTable(report.saas));
    lines.push("");
    lines.push(bold("Trademark Filing Cost Estimates"));
    lines.push(`  USPTO (TEAS Plus): ~$${report.trademarkFilingEstimates.uspto.perClass}/class`);
    lines.push(`    ${dim(report.trademarkFilingEstimates.uspto.note)}`);
    lines.push(`  EUIPO: ~EUR ${report.trademarkFilingEstimates.euipo.perClass}/class`);
    lines.push(`    ${dim(report.trademarkFilingEstimates.euipo.note)}`);
    lines.push("");
    lines.push(bold("Limitations"));
    for (const l of report.limitations) {
        lines.push(`  ${dim("\u2022")} ${l}`);
    }
    lines.push("");
    lines.push(dim(`Checks completed: ${report.checksCompleted}/${report.checksTotal}`));
    return lines.join("\n");
}
