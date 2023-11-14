import { Express, Request, Response } from "express";
import type { RouteDefinition } from "@/Types";

const ListUsers: RouteDefinition = {
    HTTPName: "list users",
    method: "get",
    path: "/users",
    RouteDescription: "get",
    execute: (app: Express) => {
        app.get(ListUsers.path, (req: Request, res: Response) => {
            const users = [
                {
                    name: "John",
                    age: 30,
                },
                {
                    name: "Jane",
                    age: 20,
                },
            ];
            res.send(users);
        });
    },
};

export default ListUsers;
