const moment = require("moment");
interface LogData {
    type: string;
    print: string;
    time?: string;
}
export function Log(data: LogData) {
    if (!data) return;
    data.time = moment().format("YYYY-MM-DD hh:mm:ss");
    let color = "";
    switch (data.type) {
        case "EMERG":
            color = "\x1b[41m";
            break;
        case "ALERT":
            color = "\x1b[91m";
            break;
        case "CRIT":
            color = "\x1b[91m";
            break;
        case "ERR":
            color = "\x1b[31m";
            break;
        case "WARN":
            color = "\x1b[33m";
            break;
        case "NOTICE":
            color = "\x1b[37m";
            break;
        case "INFO":
            color = "\x1b[94m";
            break;
        case "DEBUG":
            color = "\x1b[96m";
            break;
    }
    console.log(
        `${data.time} =>`,
        color,
        `[${data.type}]`,
        "\x1b[0m",
        `${data.print}`
    );
}
