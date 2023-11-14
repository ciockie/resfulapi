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

                        const UsersCollection = new MongoDBCrud("users");
                        await UsersCollection.connect();
                        const User = await UsersCollection.find({
                            userId: event.source.userId,
                        });

                        const message = event.message.text;
                        const TimeOfThailand = new Date();
                        TimeOfThailand.setHours(TimeOfThailand.getHours() + 7);
                        const DateOfThailand = new Date(
                            TimeOfThailand.setHours(0, 0, 0),
                        );

                        const TokensCollection = new MongoDBCrud("tokens");
                        const OneDayPassword = await TokensCollection.find({
                            time: {
                                $gt: DateOfThailand,
                            },
                        });

                        if (!User) {
                            return;
                        }

                        if (
                            OneDayPassword &&
                            User[0].status === false &&
                            OneDayPassword[0].token === message
                        ) {
                            //update user status
                            await UsersCollection.update(
                                { userId: event.source.userId },
                                { status: true },
                            );
                            //reply message
                            return LineClient.replyMessage(event.replyToken, {
                                type: "text",
                                text: "ยินดีต้อนรับเข้าสู่ระบบ",
                            });
                        }
                        if (!User[0].status) {
                            return;
                        }
                        if (
                            User[0].role === "admin" ||
                            User[0].role === "editor" ||
                            User[0].role === "user"
                        ) {
                            // handle events
                            const message = event.message as PayloadMessage;
                            message.source = event.source;
                            message.replyToken = event.replyToken;

                            const EventHandle = Events.get(message.type);
                            if (!EventHandle) {
                                return;
                            }

                            // check exits command
                            const Args = message.text.trim().split(/\s+/);
                            const CommandName =
                                Args.shift()?.toLowerCase() || "";
                            const Command = BotCommands.get(CommandName);
                            if (Command) {
                                // collect logs
                                const LogsCollection = new MongoDBCrud("logs");
                                await LogsCollection.connect();

                                await LogsCollection.insert({
                                    ...event,
                                    time: TimeOfThailand,
                                });
                            }

                            EventHandle.execute(
                                message,
                                event.replyToken,
                                BotCommands,
                            );
                        } else {
                            return;
                        }
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
