import ora from "ora";
import { fetchApiRaw } from "../api.js";
import { isPlain, bold, green, yellow, cyan, red, dim } from "../format/colors.js";
function statusSymbol(status) {
    switch (status) {
        case "pass":
            return green("\u2713");
        case "limited":
            return cyan("\u25cb");
        case "warn":
            return yellow("!");
        case "fail":
            return red("\u2717");
        default:
            return "?";
    }
}
function statusLabel(status) {
    switch (status) {
        case "pass":
            return green("pass");
        case "limited":
            return cyan("limited");
        case "warn":
            return yellow("warn");
        case "fail":
            return red("FAIL");
        default:
            return status;
    }
}
export function registerHealthCommand(program) {
    program
        .command("health")
        .description("Check API component health status")
        .action(async (_opts, cmd) => {
        const globals = cmd.optsWithGlobals();
        const spinner = !globals.json && !isPlain() ? ora("Checking API health...").start() : null;
        try {
            const data = (await fetchApiRaw("health"));
            spinner?.stop();
            if (globals.json) {
                console.log(JSON.stringify(data, null, 2));
                return;
            }
            const overall = data.status === "healthy"
                ? green(data.status)
                : data.status === "degraded"
                    ? yellow(data.status)
                    : red(data.status);
            console.log("");
            console.log(`${bold("API Health")}: ${overall}  ${dim(data.timestamp)}`);
            console.log("");
            for (const comp of data.components) {
                const sym = statusSymbol(comp.status);
                const label = statusLabel(comp.status);
                const name = comp.id.padEnd(24);
                const ms = comp.latencyMs != null ? dim(`${comp.latencyMs}ms`) : "";
                const err = comp.error ? red(` ${comp.error}`) : "";
                console.log(`  ${sym} ${name} ${label}  ${ms}${err}`);
            }
            if (data.status === "unhealthy") {
                process.exitCode = 1;
            }
        }
        catch (err) {
            spinner?.fail("Health check failed");
            throw err;
        }
    });
}
