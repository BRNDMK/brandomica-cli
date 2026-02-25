import chalk from "chalk";
let plain = false;
export function setPlain(value) {
    plain = value;
}
export function isPlain() {
    return plain || !!process.env.NO_COLOR || !process.stdout.isTTY;
}
export const SYM = {
    get ok() {
        return isPlain() ? "[OK]" : chalk.green("\u2713");
    },
    get fail() {
        return isPlain() ? "[X]" : chalk.red("\u2717");
    },
    get warn() {
        return isPlain() ? "[?]" : chalk.yellow("?");
    },
    get info() {
        return isPlain() ? "[i]" : chalk.cyan("i");
    },
    get block() {
        return isPlain() ? "[!]" : chalk.red("!");
    },
};
export function green(s) {
    return isPlain() ? s : chalk.green(s);
}
export function red(s) {
    return isPlain() ? s : chalk.red(s);
}
export function yellow(s) {
    return isPlain() ? s : chalk.yellow(s);
}
export function cyan(s) {
    return isPlain() ? s : chalk.cyan(s);
}
export function dim(s) {
    return isPlain() ? s : chalk.dim(s);
}
export function bold(s) {
    return isPlain() ? s : chalk.bold(s);
}
export function bgRed(s) {
    return isPlain() ? `[${s}]` : chalk.bgRed.white(` ${s} `);
}
export function bgYellow(s) {
    return isPlain() ? `[${s}]` : chalk.bgYellow.black(` ${s} `);
}
export function bgGreen(s) {
    return isPlain() ? `[${s}]` : chalk.bgGreen.black(` ${s} `);
}
export function riskColor(risk) {
    switch (risk) {
        case "low":
            return green;
        case "medium":
            return yellow;
        case "high":
            return red;
    }
}
export function riskBadge(risk) {
    switch (risk) {
        case "low":
            return bgGreen("LOW");
        case "medium":
            return bgYellow("MEDIUM");
        case "high":
            return bgRed("HIGH");
    }
}
export function availabilitySymbol(available) {
    if (available === true)
        return SYM.ok;
    if (available === false)
        return SYM.fail;
    return SYM.warn;
}
