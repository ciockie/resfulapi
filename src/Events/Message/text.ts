import { Events } from "@/Types";
import LineBotHandler from "@/Libs/LineBotHandle";
const LineClient = new LineBotHandler();

const EventMessage: Events = {
    EventName: "EventMessage",
    EventDescription: "For handle message event",
    EventType: "message",
    execute: async (message, replytoken, commands) => {
        // handle Text message
        if (message.source.userId && message.type === "text") {
            const Args = message.text.trim().split(/\s+/);
            const CommandName = Args.shift()?.toLocaleLowerCase() || "";

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
            if (Result.status === true) {
                return LineClient.replyMessage(replytoken, {
                    type: "text",
                    text: Result.message,
                });
            }
        }
    },
};

export default EventMessage;
