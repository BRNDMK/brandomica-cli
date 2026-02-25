import { writeFileSync } from "node:fs";
import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import { isPlain, dim } from "../format/colors.js";
import { formatReport } from "../format/report.js";
export function registerReportCommand(program) {
    program
        .command("report <name>")
        .description("Generate full brand safety report")
        .option("-s, --save <path>", "Save JSON report to file")
        .action(async (rawName, opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const name = validateName(rawName);
        const spinner = !globals.json && !isPlain()
            ? ora("Generating brand safety report...").start()
            : null;
        try {
            const data = (await fetchApi("brand-report", name));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
            }
            else {
                console.log("");
                console.log(formatReport(data));
            }
            if (opts.save) {
                writeFileSync(opts.save, JSON.stringify(data, null, 2), "utf-8");
                console.log("");
                console.log(dim(`Report saved to ${opts.save}`));
            }
        }
        catch (err) {
            spinner?.fail("Report generation failed");
            throw err;
        }
    });
}
