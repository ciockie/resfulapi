import { BotConfigData, Events } from "@/Types";
import { MongoDBCrud } from "@/Libs/Mongo";
import LineBotHandler from "@/Libs/LineBotHandle";
import { IDFormatter } from "@/Libs/MessageFormatter";
const LineClient = new LineBotHandler();

const allowedCommands = ["help", "myid"];

const EventMessage: Events = {
    EventName: "EventMessage",
    EventDescription: "For handle message event",
    EventType: "message",
    execute: async (message, replytoken, commands) => {
        if (!message.source.userId) return;
        //check user permission
        const UsersCollection = new MongoDBCrud("users");
        await UsersCollection.connect();
        const User = await UsersCollection.find({
            userId: message.source.userId,
        });
        // handle Text message
        if (message.type === "text") {
            //if text not included in allowedCommands
            if (!allowedCommands.includes(message.text)) {
                if (!User || User.length === 0 || User[0].status === false) {
                    return;
                }
            }

            //check commands aviailable
            const BotConfigCollection = new MongoDBCrud("botconfigs");
            await BotConfigCollection.connect();
            const BotCommandsConfig: BotConfigData & { _id: string } =
                (await BotConfigCollection.findOne(
                    {},
                )) as unknown as BotConfigData & { _id: string };
            const BotCommandsAvailable = BotCommandsConfig.commands || [];
            const Args = message.text.trim().split(/\s+/);
            const CommandName = Args.shift()?.toLocaleLowerCase() || "";
            const BotCommandsAvailableObject = BotCommandsAvailable.find(
                (command) => command.name === CommandName,
            );
            if (
                BotCommandsAvailableObject &&
                BotCommandsAvailableObject.status === false
            )
                return;

            const Command = commands.get(CommandName);
            if (!Command) return;
            const UserProfile = await LineClient.getProfile(
                message.source.userId,
            );
            if (!UserProfile) {
                return LineClient.replyMessage(replytoken, {
                    type: "text",
                    text: "กรุณาเพิ่มเพื่อนก่อนใช้คำสั่ง",
                });
            }
            const Result = await Command.CommandFunction(
                Args,
                message.source.userId,
            );
            if (!Result) return;
            if (Result.status === false && typeof Result.message === "string") {
                return LineClient.replyMessage(replytoken, {
                    type: "text",
                    text: Result.message,
                });
            }
            if (Result.status === true && Array.isArray(Result.message)) {
                //formatter
                switch (CommandName) {
                    case "id":
                        const MesssageFormatted = IDFormatter(Result.message);
                        LineClient.replyMessage(replytoken, MesssageFormatted);
                        break;
                }
            }
        }
    },
};

export default EventMessage;
