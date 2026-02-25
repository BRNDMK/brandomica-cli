import ora from "ora";
import { fetchApiPost, validateName } from "../api.js";
import { isPlain, bold, green, yellow, red, dim, riskBadge, } from "../format/colors.js";
function scoreColor(score, max) {
    const pct = score / max;
    if (pct >= 0.7)
        return green;
    if (pct >= 0.4)
        return yellow;
    return red;
}
export function registerBatchCommand(program) {
    program
        .command("batch <names...>")
        .description("Batch check 2-50 brand names (summary table)")
        .option("-m, --mode <mode>", "Check mode: quick or full", "quick")
        .action(async (rawNames, opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        if (rawNames.length < 2 || rawNames.length > 50) {
            console.error("Error: Provide 2-50 brand names for batch check.");
            process.exit(1);
        }
        const names = rawNames.map((n) => validateName(n));
        const spinner = !globals.json && !isPlain()
            ? ora(`Batch checking ${names.length} names (${opts.mode})...`).start()
            : null;
        try {
            const data = (await fetchApiPost("batch-check", {
                names,
                mode: opts.mode,
            }));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
                return;
            }
            console.log("");
            console.log(bold(`Batch Results (${data.count} names, ${data.mode} mode)`));
            console.log("");
            // Header
            const header = `  ${"Name".padEnd(20)} ${"Score".padEnd(8)} ${"Safety".padEnd(10)} ${"Risk"}`;
            console.log(dim(header));
            console.log(dim("  " + "\u2500".repeat(55)));
            for (const r of data.results) {
                const color = scoreColor(r.score.score, r.score.maxScore);
                const name = r.name.padEnd(20);
                const score = color(`${r.score.score}/${r.score.maxScore}`.padEnd(8));
                const safety = `${r.safety.safetyScore}/100`.padEnd(10);
                const risk = riskBadge(r.safety.overallRisk);
                console.log(`  ${name} ${score} ${safety} ${risk}`);
            }
        }
        catch (err) {
            spinner?.fail("Batch check failed");
            throw err;
        }
    });
}
