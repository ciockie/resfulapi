import { Express, Request, Response } from "express";
import type { RouteDefinition } from "@/Types";

const HelloWorld: RouteDefinition = {
    HTTPName: "HelloWorld",
    method: "get",
    path: "/",
    RouteDescription: "get",
    execute: (app: Express) => {
        app.get(HelloWorld.path, (req: Request, res: Response) => {
            res.send("Hello World");
        });
    },
};

export default HelloWorld;
