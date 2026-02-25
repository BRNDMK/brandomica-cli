import { bold, dim, green, yellow, red, riskBadge, riskColor, SYM, } from "./colors.js";
function scoreColor(score, max) {
    const pct = score / max;
    if (pct >= 0.7)
        return green;
    if (pct >= 0.4)
        return yellow;
    return red;
}
export function formatScoreCard(score) {
    const color = scoreColor(score.score, score.maxScore);
    const lines = [];
    lines.push(bold("Availability Score"));
    lines.push(`  ${color(`${score.score}/${score.maxScore}`)} ${dim(`(${score.confidence} confidence, ${score.totalChecks} checks)`)}`);
    if (score.confidence === "low" &&
        score.missingCriticalCategories?.length) {
        lines.push(`  ${SYM.warn} ${yellow("Low confidence")} \u2014 missing: ${score.missingCriticalCategories.join(", ")}`);
    }
    if (score.breakdown.length > 0) {
        const chips = score.breakdown.map((b) => b.label).join(dim(" | "));
        lines.push(`  ${chips}`);
    }
    return lines.join("\n");
}
export function formatSafetyCard(safety) {
    const lines = [];
    lines.push(bold("Brand Safety Assessment"));
    lines.push(`  ${riskBadge(safety.overallRisk)}  ${bold(`${safety.safetyScore}/100`)} \u2014 ${safety.headline}`);
    lines.push(`  ${dim(safety.summary)}`);
    lines.push("");
    for (const signal of safety.signals) {
        const color = riskColor(signal.risk);
        const riskLabel = signal.risk.toUpperCase().padEnd(6);
        const criticalMark = signal.critical ? red(" [CRITICAL]") : "";
        lines.push(`  ${color(riskLabel)} ${signal.label}: ${signal.summary}${criticalMark}`);
    }
    if (safety.blockers.length > 0) {
        lines.push("");
        lines.push(`  ${SYM.block} ${red(bold("Blockers:"))}`);
        for (const b of safety.blockers) {
            lines.push(`    ${red("\u2192")} ${b}`);
        }
    }
    if (safety.actions.length > 0) {
        lines.push("");
        lines.push(`  ${bold("Recommended Actions:")}`);
        for (const a of safety.actions) {
            lines.push(`    ${dim("\u2022")} ${a}`);
        }
    }
    return lines.join("\n");
}
