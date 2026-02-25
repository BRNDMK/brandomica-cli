import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import { isPlain } from "../format/colors.js";
import { formatDomainsTable } from "../format/table.js";
export function registerDomainsCommand(program) {
    program
        .command("domains <name>")
        .description("Check domain availability and pricing")
        .action(async (rawName, _opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const name = validateName(rawName);
        const spinner = !globals.json && !isPlain()
            ? ora("Checking domains...").start()
            : null;
        try {
            const data = (await fetchApi("check-domains", name));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
                return;
            }
            console.log("");
            console.log(formatDomainsTable(data.results));
        }
        catch (err) {
            spinner?.fail("Domain check failed");
            throw err;
        }
    });
}
