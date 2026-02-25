import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import { isPlain } from "../format/colors.js";
import { formatScoreCard, formatSafetyCard } from "../format/score.js";
import { formatDomainsTable, formatSocialTable, formatTrademarksTable, formatAppStoresTable, formatSaasTable, formatGoogleTable, } from "../format/table.js";
export function registerCheckCommand(program) {
    program
        .command("check <name>")
        .description("Full brand name check (score + safety + all evidence)")
        .option("-q, --quick", "Quick mode (fewer checks, faster)")
        .action(async (rawName, opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const name = validateName(rawName);
        const mode = opts.quick ? "quick" : "full";
        const spinner = !globals.json && !isPlain()
            ? ora(`Checking "${name}"${mode === "quick" ? " (quick)" : ""}...`).start()
            : null;
        try {
            const extra = mode !== "full" ? { mode } : undefined;
            const data = (await fetchApi("check-all", name, extra));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
                return;
            }
            console.log("");
            console.log(formatScoreCard(data.score));
            console.log("");
            console.log(formatSafetyCard(data.safety));
            console.log("");
            console.log(formatDomainsTable(data.domains));
            console.log("");
            console.log(formatSocialTable(data.social));
            console.log("");
            console.log(formatTrademarksTable(data.trademarks));
            console.log("");
            console.log(formatGoogleTable(data.google));
            console.log("");
            console.log(formatAppStoresTable(data.appStores));
            console.log("");
            console.log(formatSaasTable(data.saas));
            if (data.safety.blockers.length > 0) {
                process.exitCode = 2;
            }
        }
        catch (err) {
            spinner?.fail("Check failed");
            throw err;
        }
    });
}
