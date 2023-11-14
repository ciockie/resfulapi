import { Express, Request, Response } from "express";
import type { RouteDefinition } from "@/Types";

const route: RouteDefinition = {
    HTTPName: "Logs",
    method: "get",
    path: "/dashboard/accessed",
    RouteDescription: "Get the number of times the dashboard has been accessed",
    execute: (app: Express) => {
        app.get(route.path, (req: Request, res: Response) => {
            res.send({ accessed: 0 });
        });
    },
};

export default route;
