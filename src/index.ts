//Load ENV
import { Log } from "@/Utils/Log";
Log({
    type: "WARN",
    print: `Registering services.`,
});
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

import express, { Express } from "express";

import type { RouteDefinition, BotCommands, Events } from "@/Types";
import bodyParser from "body-parser";

const app: Express = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

// Bot Commands Handler
const BotCommands: Map<string, BotCommands> = new Map();
const BotCommandsFolders: string[] = fs.readdirSync(
    path.join(__dirname, "BotCommands"),
);

for (const BotCommandsFolder of BotCommandsFolders) {
    const BotCommandsFiles: string[] = fs
        .readdirSync(path.join(__dirname, "BotCommands", BotCommandsFolder))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const BotCommandsFile of BotCommandsFiles) {
        const CommandModule: BotCommands = require(path.join(
            __dirname,
            "BotCommands",
            BotCommandsFolder,
            BotCommandsFile,
        )).default;
        BotCommands.set(CommandModule.CommandName, CommandModule);
    }
}

// Events Handler
const Events: Map<string, Events> = new Map();
const EventsFolders: string[] = fs.readdirSync(path.join(__dirname, "Events"));
for (const EventsFolder of EventsFolders) {
    const EventsFiles: string[] = fs
        .readdirSync(path.join(__dirname, "Events", EventsFolder))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const EventsFile of EventsFiles) {
        const EventModule: Events = require(path.join(
            __dirname,
            "Events",
            EventsFolder,
            EventsFile,
        )).default;
        Events.set(EventModule.EventName, EventModule);
    }
}

// HTTP Handlers
const HTTPPaths: RouteDefinition[] = [];
const HTTPPathFolders: string[] = fs.readdirSync(path.join(__dirname, "HTTP"));
for (const HTTPPathFolder of HTTPPathFolders) {
    const HTTPPathFiles: string[] = fs
        .readdirSync(path.join(__dirname, "HTTP", HTTPPathFolder))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const HTTPPathFile of HTTPPathFiles) {
        const route: RouteDefinition = require(path.join(
            __dirname,
            "HTTP",
            HTTPPathFolder,
            HTTPPathFile,
        )).default;
        if (typeof route.execute === "function") {
            HTTPPaths.push(route);
            route.execute(app, BotCommands, Events);
        }
    }
}

//start server
app.listen(port, () => {
    //sort http by method get->post->put->delete and path
    HTTPPaths.sort((a, b) => {
        if (a.method < b.method) return 1;
        if (a.method > b.method) return -1;
        if (a.path < b.path) return 1;
        if (a.path > b.path) return -1;
        return 0;
    });

    Log({
        type: "WARN",
        print: `Registered event handle.`,
    });
    Events.forEach((Event, index) => {
        Log({
            type: "INFO",
            print: `|-${Event.EventName.padEnd(16)} [${(Event.EventType + "]")
                .toUpperCase()
                .padEnd(6)}`,
        });
    });

    Log({
        type: "WARN",
        print: `Registered list commands.`,
    });
    BotCommands.forEach((Command, index) => {
        Log({
            type: "INFO",
            print: `|-${Command.CommandName.padEnd(16)}`,
        });
    });

    updateCommand();

    Log({
        type: "WARN",
        print: `Registered http paths.`,
    });
    HTTPPaths.forEach((HTTPPath, index) => {
        Log({
            type: "INFO",
            print: `|-${HTTPPath.HTTPName.padEnd(16)} [${(HTTPPath.method + "]")
                .toUpperCase()
                .padEnd(6)} => path : ${HTTPPath.path}`,
        });
    });

    Log({
        type: "WARN",
        print: `Server is running on port ${port}.`,
    });
});

//update command
function updateCommand() {
    // update commands to mongodb
}
