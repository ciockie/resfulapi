import { BotCommands, CommandResponse, IDCardData } from "@/Types";
import { StatCollect } from "@/Libs/StatCollect";
import MSSQLCrud from "@/Libs/MSSQL";
const SearchIDCard: BotCommands = {
    CommandName: "search",
    CommandDescription: "ค้นหาข้อมูลบัตรประชาชน",
    CommandFunction: async (
        args: string[],
        userId: string,
    ): Promise<CommandResponse> => {
        return new Promise(async (resolve, reject) => {
            if (args.length === 0) return;
            if (args.length > 1) {
                args.filter((arg) => {
                    return /^[0-9]*$/.test(arg) && arg.length === 13;
                });
                let IDResault: IDCardData[] = [];
                for (const id of args) {
                    const result = await FindID(userId, id);
                    if (result) IDResault.push(result);
                }
                if (IDResault.length === 0) {
                    resolve({
                        status: false,
                        message: "ไม่พบข้อมูล",
                    });
                }
                // TODO: resolve array message
                resolve({
                    status: true,
                    message: IDResault,
                });
            }
        });
    },
};

export default SearchIDCard;

function FindID(userId: string, id: string): Promise<IDCardData | undefined> {
    //collect statistics
    StatCollect(userId, "id", id);

    return new Promise(async (resolve, reject) => {
        const mssql = new MSSQLCrud();
        const QueryP = await mssql.read(
            `SELECT [บคคล_].* 
            FROM dbo.[บคคล_] 
            WHERE [บคคล_].[หมายเลขบตรประชาชน_] = @id 
            ORDER BY [บคคล_].Last_Upd_Date DESC`,
            [
                {
                    name: "id",
                    type: "NVarChar",
                    value: id,
                },
            ],
        );
        const result = QueryP as unknown as IDCardData[];
        if (result.length === 0) resolve(void 0);
        else if (result[0].พฤตกรรมบคคล_ === null) {
            const QueryC = await mssql.read(
                `SELECT _LinkEnd.* 
                FROM dbo._LinkEnd 
                WHERE _LinkEnd.Entity_ID1 = @Unique_ID`,
                [
                    {
                        name: "Unique_ID",
                        type: "NVarChar",
                        value: result[0].Unique_ID,
                    },
                ],
            );
            const checked = QueryC as unknown as Array<{
                [key: string]: string;
            }>;
            if (
                checked.length === 1 &&
                checked[0].Entity_ID2.startsWith(`การ`)
            ) {
                //new result = result[0] + traveling : true
                const newRes = Object.assign({}, result[0]);
                newRes.traveling = true;
                resolve(newRes);
            }
        }
        console.log(result[0]);
        resolve(result[0]);
    });
}
