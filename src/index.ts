#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Command } from "commander";
import { setPlain } from "./format/colors.js";
import { setApiBase, ApiError } from "./api.js";
import { registerCheckCommand } from "./commands/check.js";
import { registerCompareCommand } from "./commands/compare.js";
import { registerBatchCommand } from "./commands/batch.js";
import { registerDomainsCommand } from "./commands/domains.js";
import { registerSocialCommand } from "./commands/social.js";
import { registerTrademarksCommand } from "./commands/trademarks.js";
import { registerSafetyCommand } from "./commands/safety.js";
import { registerFilingCommand } from "./commands/filing.js";
import { registerReportCommand } from "./commands/report.js";
import { registerHealthCommand } from "./commands/health.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8"));

const program = new Command();

program
  .name("brandomica")
  .description(
    "Brandomica Lab \u2014 brand name verification from the terminal",
  )
  .version(pkg.version)
  .option("--json", "Output raw JSON")
  .option("--plain", "No colors or spinners")
  .option("--api-url <url>", "Override API base URL")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.optsWithGlobals();
    if (opts.plain) setPlain(true);
    if (opts.apiUrl) setApiBase(opts.apiUrl);
  });

registerCheckCommand(program);
registerCompareCommand(program);
registerBatchCommand(program);
registerDomainsCommand(program);
registerSocialCommand(program);
registerTrademarksCommand(program);
registerSafetyCommand(program);
registerFilingCommand(program);
registerReportCommand(program);
registerHealthCommand(program);

program.parseAsync().catch((err) => {
  if (err instanceof ApiError) {
    console.error(`API Error: ${err.message}`);
  } else if (err instanceof Error) {
    console.error(`Error: ${err.message}`);
  } else {
    console.error("Unknown error", err);
  }
  process.exit(1);
});
