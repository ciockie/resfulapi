import { LineConfig, Message, LineBotHandlerInterface } from "@/Types";
import { Client, middleware } from "@line/bot-sdk";
import { channelAccessToken as ca, channelSecret as cs } from "@/Libs/Conf";

class LineBotHandler implements LineBotHandlerInterface {
    static channelAccessToken = ca;
    static channelSecret = cs;

    private client: Client;
    private config: LineConfig;

    constructor() {
        this.config = {
            channelAccessToken: LineBotHandler.channelAccessToken,
            channelSecret: LineBotHandler.channelSecret,
        };

        this.client = new Client(this.config);
    }

    middleware() {
        return middleware(this.config);
    }

    async replyMessage(replyToken: string, message: Message): Promise<any> {
        try {
            await this.client.replyMessage(replyToken, message);
        } catch (error: any) {
            console.error(`Error replying to message: ${error.message}`);
        }
    }

    async pushMessage(userId: string, message: Message): Promise<any> {
        try {
            await this.client.pushMessage(userId, message);
        } catch (error: any) {
            console.error(`Error pushing message: ${error.message}`);
        }
    }

    async downloadContent(messageId: string): Promise<Buffer | null> {
        try {
            return new Promise<Buffer | null>(async (resolve, reject) => {
                this.client.getMessageContent(messageId).then((stream) => {
                    const chunks: Buffer[] = [];
                    stream.on("data", (chunk) => {
                        chunks.push(chunk);
                    });
                    stream.on("error", (err) => {
                        console.error(`Error downloading content: ${err}`);
                        reject(err);
                    });
                    stream.on("end", () => {
                        resolve(Buffer.concat(chunks));
                    });
                });
            });
        } catch (error: any) {
            console.error(`Error downloading content: ${error.message}`);
            return null;
        }
    }

    async getProfile(userId: string) {
        try {
            const response = await this.client.getProfile(userId);
            return response;
        } catch (error: any) {
            console.error(`Error getting profile: ${error.message}`);
            return null;
        }
    }

    async getGroupAllMemberProfile(groupId: string) {
        try {
            const response = await this.client.getGroupMemberProfile(
                groupId,
                "all",
            );
            return response;
        } catch (error: any) {
            console.error(`Error getting profile: ${error.message}`);
            return null;
        }
    }
}

export default LineBotHandler;
