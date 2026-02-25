import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import { isPlain, bold, green, yellow, red, dim, bgGreen, bgYellow, bgRed, } from "../format/colors.js";
function verdictBadge(verdict) {
    switch (verdict) {
        case "ready":
            return bgGreen("READY");
        case "caution":
            return bgYellow("CAUTION");
        case "blocked":
            return bgRed("BLOCKED");
    }
}
export function registerFilingCommand(program) {
    program
        .command("filing <name>")
        .description("Filing readiness summary")
        .option("-q, --quick", "Quick mode")
        .action(async (rawName, opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const name = validateName(rawName);
        const extra = opts.quick ? { mode: "quick" } : undefined;
        const spinner = !globals.json && !isPlain()
            ? ora("Checking filing readiness...").start()
            : null;
        try {
            const data = (await fetchApi("filing-readiness", name, extra));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
                return;
            }
            const fr = data.filingReadiness;
            console.log("");
            console.log(bold("Filing Readiness"));
            console.log(`  ${verdictBadge(fr.verdict)}  Risk: ${fr.filingRisk}  Confidence: ${fr.confidence}`);
            if (fr.missingCriticalCategories.length > 0) {
                console.log(`  ${yellow("Missing:")} ${fr.missingCriticalCategories.join(", ")}`);
            }
            if (fr.topConflicts.length > 0) {
                console.log("");
                console.log(`  ${bold("Top Conflicts:")}`);
                for (const c of fr.topConflicts) {
                    const sev = c.severity === "high"
                        ? red(c.severity)
                        : c.severity === "medium"
                            ? yellow(c.severity)
                            : green(c.severity);
                    const jurisdiction = c.jurisdiction
                        ? dim(` (${c.jurisdiction})`)
                        : "";
                    console.log(`    ${sev} ${c.source}${jurisdiction}: ${c.description}`);
                    console.log(`      ${dim(c.whyItMatters)}`);
                }
            }
            if (fr.actions.length > 0) {
                console.log("");
                console.log(`  ${bold("Actions:")}`);
                for (const a of fr.actions) {
                    console.log(`    ${dim("\u2022")} ${a}`);
                }
            }
            if (fr.verdict === "blocked") {
                process.exitCode = 2;
            }
        }
        catch (err) {
            spinner?.fail("Filing readiness check failed");
            throw err;
        }
    });
}
