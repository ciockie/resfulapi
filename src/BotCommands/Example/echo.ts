import { BotCommands, CommandResponse } from "@/Types";
const SearchIDCard: BotCommands = {
    CommandName: "echo",
    CommandDescription: "ตอบกลับด้วยข้อความที่ส่งเข้ามา",
    CommandFunction: async (
        args: string[],
        userId: string,
    ): Promise<CommandResponse> => {
        return new Promise(async (resolve, reject) => {
            resolve({
                status: true,
                message: args.join(" "),
            });
        });
    },
};

export default SearchIDCard;
