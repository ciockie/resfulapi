import { Express, Request, Response } from "express";
import type { RouteDefinition } from "@/Types";

const GetLogs: RouteDefinition = {
    HTTPName: "HelloWorld",
    method: "get",
    path: "/",
    RouteDescription: "get",
    execute: (app: Express) => {
        app.get(GetLogs.path, (req: Request, res: Response) => {
            res.send("Hello World");
        });
    },
};

export default GetLogs;
