import { Express, Request, Response } from "express";
import type { RouteDefinition } from "@/Types";
import { TextEventMessage, EventSource } from "@/Types/line.model";
import { WebhookEvent } from "@/Types/line.model";
import { MongoDBCrud } from "@/Libs/Mongo";
import LineBotHandler from "@/Libs/LineBotHandle";
const LineClient = new LineBotHandler();

type AdditionalMessage = {
    source: EventSource;
    replyToken: string;
};
type PayloadMessage = TextEventMessage & AdditionalMessage;
//LineClient.middleware(),
const webhook: RouteDefinition = {
    HTTPName: "Webhook",
    method: "post",
    path: "/webhook",
    RouteDescription: "For handle LINE webhook",
    execute: (app, BotCommands, Events) => {
        app.post(webhook.path, (req: Request, res: Response) => {
            console.log(req.body);
            if (!Array.isArray(req.body.events)) {
                return res.status(500).end();
            }
            Promise.all(
                req.body.events.map(async (event: WebhookEvent) => {
                    //for message event
                    if (
                        event.type === "message" &&
                        event.message.type === "text"
                    ) {
                        if (
                            event.replyToken ===
                                "00000000000000000000000000000000" ||
                            event.replyToken ===
                                "ffffffffffffffffffffffffffffffff"
                        ) {
                            return;
                        }

                        // handle events
                        const message = event.message as PayloadMessage;
                        message.source = event.source;
                        message.replyToken = event.replyToken;

                        const EventHandle = Events.get(message.type);
                        if (!EventHandle) {
                            return;
                        }
                        EventHandle.execute(
                            message,
                            event.replyToken,
                            BotCommands,
                        );
                    }
                }),
            )
                .then(() => res.end())
                .catch((err) => {
                    console.error(err);
                    res.status(500).end();
                });
        });
    },
};

export default webhook;
