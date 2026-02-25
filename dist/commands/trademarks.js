import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import { isPlain } from "../format/colors.js";
import { formatTrademarksTable } from "../format/table.js";
export function registerTrademarksCommand(program) {
    program
        .command("trademarks <name>")
        .description("Search trademark registries")
        .action(async (rawName, _opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const name = validateName(rawName);
        const spinner = !globals.json && !isPlain()
            ? ora("Searching trademarks...").start()
            : null;
        try {
            const data = (await fetchApi("check-trademarks", name));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
                return;
            }
            console.log("");
            console.log(formatTrademarksTable(data.results));
        }
        catch (err) {
            spinner?.fail("Trademark search failed");
            throw err;
        }
    });
}
