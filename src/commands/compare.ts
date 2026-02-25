import type { Command } from "commander";
import ora from "ora";
import { fetchApiPost, validateName } from "../api.js";
import type { CompareResponse, CheckAllResponse } from "../types.js";
import {
  isPlain,
  bold,
  green,
  yellow,
  red,
  dim,
  riskBadge,
} from "../format/colors.js";

function scoreColor(score: number, max: number): (s: string) => string {
  const pct = score / max;
  if (pct >= 0.7) return green;
  if (pct >= 0.4) return yellow;
  return red;
}

function formatCompareRow(r: CheckAllResponse): string {
  const lines: string[] = [];
  const color = scoreColor(r.score.score, r.score.maxScore);
  lines.push(
    `  ${bold(r.name.padEnd(20))} Score: ${color(`${r.score.score}/${r.score.maxScore}`)}  Safety: ${riskBadge(r.safety.overallRisk)} ${r.safety.safetyScore}/100`,
  );

  const available = r.domains.filter((d) => d.available).length;
  const total = r.domains.length;
  lines.push(
    `    Domains: ${available}/${total} available  .com: ${r.domains.find((d) => d.domain.endsWith(".com"))?.available ? green("yes") : red("no")}`,
  );

  const socialAvail = r.social.filter((s) => s.available === true).length;
  const socialTaken = r.social.filter(
    (s) => s.available === false,
  ).length;
  lines.push(
    `    Social: ${green(`${socialAvail} free`)} ${red(`${socialTaken} taken`)}`,
  );

  const tmConflicts = r.trademarks
    .filter((t) => t.available === false)
    .reduce((sum, t) => sum + t.count, 0);
  lines.push(
    `    Trademarks: ${tmConflicts === 0 ? green("clear") : red(`${tmConflicts} conflicts`)}`,
  );

  if (r.safety.blockers.length > 0) {
    lines.push(
      `    ${red("Blockers:")} ${r.safety.blockers.join("; ")}`,
    );
  }

  return lines.join("\n");
}

export function registerCompareCommand(program: Command): void {
  program
    .command("compare <names...>")
    .description("Compare 2-5 brand names side-by-side")
    .action(async (rawNames: string[], _opts, cmd) => {
      const globals = cmd.optsWithGlobals();

      if (rawNames.length < 2 || rawNames.length > 5) {
        console.error("Error: Provide 2-5 brand names to compare.");
        process.exit(1);
      }

      const names = rawNames.map((n) => validateName(n));
      const spinner =
        !globals.json && !isPlain()
          ? ora(`Comparing ${names.length} names...`).start()
          : null;

      try {
        const data = (await fetchApiPost("compare-brands", {
          names,
        })) as CompareResponse;
        spinner?.stop();

        if (globals.json) {
          console.log(JSON.stringify(data, null, 2));
          return;
        }

        console.log("");
        console.log(bold("Brand Comparison"));
        console.log("");

        for (const result of data.results) {
          console.log(formatCompareRow(result));
          console.log("");
        }

        if (data.recommendation) {
          console.log(dim("\u2500".repeat(40)));
          console.log(
            `${bold("Recommendation:")} ${data.recommendation}`,
          );
        }
      } catch (err) {
        spinner?.fail("Comparison failed");
        throw err;
      }
    });
}
