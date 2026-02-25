import type { Command } from "commander";
import ora from "ora";
import { fetchApi, validateName } from "../api.js";
import type { SocialResult } from "../types.js";
import { isPlain } from "../format/colors.js";
import { formatSocialTable } from "../format/table.js";

export function registerSocialCommand(program: Command): void {
  program
    .command("social <name>")
    .description("Check social media handle availability")
    .action(async (rawName: string, _opts, cmd) => {
      const globals = cmd.optsWithGlobals();
      const name = validateName(rawName);
      const spinner =
        !globals.json && !isPlain()
          ? ora("Checking social handles...").start()
          : null;

      try {
        const data = (await fetchApi("check-social", name)) as {
          results: SocialResult[];
        };
        spinner?.stop();

        if (globals.json) {
          console.log(JSON.stringify(data, null, 2));
          return;
        }

        console.log("");
        console.log(formatSocialTable(data.results));
      } catch (err) {
        spinner?.fail("Social check failed");
        throw err;
      }
    });
}
