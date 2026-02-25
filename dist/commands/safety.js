import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import { isPlain } from "../format/colors.js";
import { formatSafetyCard } from "../format/score.js";
export function registerSafetyCommand(program) {
    program
        .command("safety <name>")
        .description("Brand safety assessment only")
        .action(async (rawName, _opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const name = validateName(rawName);
        const spinner = !globals.json && !isPlain()
            ? ora("Assessing brand safety...").start()
            : null;
        try {
            const data = (await fetchApi("check-all", name, {
                mode: "quick",
            }));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data.safety, null, 2));
                return;
            }
            console.log("");
            console.log(formatSafetyCard(data.safety));
            if (data.safety.blockers.length > 0) {
                process.exitCode = 2;
            }
        }
        catch (err) {
            spinner?.fail("Safety assessment failed");
            throw err;
        }
    });
}
