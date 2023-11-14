import type { IDCardData, Message, BotConfigData } from "@/Types";
import { MongoDBCrud } from "@/Libs/Mongo";

function groupArray<T>(array: T[], groupSize: number): T[][] {
    const groupedArrays: T[][] = [];
    for (let i = 0; i < array.length; i += groupSize) {
        groupedArrays.push(array.slice(i, i + groupSize));
    }
    return groupedArrays;
}
function date(date: Date | string) {
    return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

//PInfo = Personal Information
export function IDFormatter(PInfo: IDCardData[]): Message {
    let TextResult: string = "";
    if (PInfo.length === 1) {
        const data: {
            [key: string]: Date | boolean | string | number | null | 0 | 1;
        } = { ...PInfo[0] };
        for (const key in data) {
            if (data[key] === null) {
                data[key] = "-";
            }
        }
        let Update: Date | string = "";
        data.Last_Upd_Date === "-"
            ? (Update = data.Create_Date as Date | string)
            : (Update = data.Last_Upd_Date as Date | string);
        TextResult =
            `==ประวัติ/พฤติกรรม==` +
            `\nหมายเลขบัตรประชาชน : ${data.หมายเลขบตรประชาชน_}` +
            `\nชื่อ-สกุล : ${data.คำนำหนา_} ${data.ชอภาษาไทย_} ${data.นามสกลภาษาไทย_}` +
            `\nพฤติกรรมย่อ : ${data.พฤตกรรมบคคล_}` +
            `\nรายละเอียดอื่นๆ : ${data.รายละเอยดอนๆ_}` +
            `\nปรับปรุงข้อมูลเมื่อ : ${date(Update)}`;
        return {
            type: "text",
            text: TextResult,
        };
    } else {
        const isWelfare = PInfo.filter(
            (message) =>
                message.รายละเอยดอนๆ_ &&
                message.รายละเอยดอนๆ_.includes(`โครงการสวัสดิการแห่งรัฐ`) &&
                message.พฤตกรรมบคคล_ === null,
        );
        const onlyTravel = PInfo.filter(
            (message) => message.traveling === true,
        );
        const notWelfare = PInfo.filter(
            (message) =>
                !isWelfare.includes(message) && !onlyTravel.includes(message),
        );
        let multiId = [];
        let textArrs = [];
        let nw = [],
            ot = [],
            iw = [];
        for (const message of notWelfare) {
            textArrs.push(`[ID] : ${message.หมายเลขบตรประชาชน_}`);
            nw.push(`[ID] : ${message.หมายเลขบตรประชาชน_}`);
        }
        for (const message of onlyTravel) {
            textArrs.push(`[#ID] : ${message.หมายเลขบตรประชาชน_}`);
            ot.push(`[#ID] : ${message.หมายเลขบตรประชาชน_}`);
        }
        for (const message of isWelfare) {
            textArrs.push(`[*ID] : ${message.หมายเลขบตรประชาชน_}`);
            iw.push(`[*ID] : ${message.หมายเลขบตรประชาชน_}`);
        }
        multiId = notWelfare.concat(isWelfare).concat(onlyTravel);

        const le = multiId.length;

        const replyMessage: Message = [];
        const groupSize = 200;

        // Check and add the "le" message
        if (le) {
            replyMessage.push({
                type: "text",
                text: `พบ ${le} บุคคล`,
            });
        }

        // Check and add the "nw" message if it's not an empty array
        const groupednwArrays = groupArray(nw, groupSize);
        if (groupednwArrays.length > 0) {
            groupednwArrays.forEach((nws, index) => {
                const header =
                    index === 0
                        ? `=== บุคคลต้องตรวจสอบเพิ่มเติม ${nw.length} คน ===`
                        : "===บุคคลต้องตรวจสอบเพิ่มเติม (ต่อ)===";
                replyMessage.push({
                    type: "text",
                    text: `${header}\n${nws.join("\n")}`,
                });
            });
        }

        // Check and add the "ot" message if it's not an empty array
        const groupedotArrays = groupArray(ot, groupSize);
        if (groupedotArrays.length > 0) {
            groupedotArrays.forEach((ots, index) => {
                const header =
                    index === 0
                        ? `===บุคคลที่เดินทาง ${ot.length} คน===`
                        : "===บุคคลที่เดินทาง (ต่อ)===";
                replyMessage.push({
                    type: "text",
                    text: `${header}\n${ots.join("\n")}`,
                });
            });
        }

        // Check and add the "iw" message if it's not an empty array
        const groupediwArrays = groupArray(iw, groupSize);
        if (groupediwArrays.length > 0) {
            groupediwArrays.forEach((iws, index) => {
                const header =
                    index === 0
                        ? `===บุคคลที่เป็นผู้รับสวัสดิการ ${iw.length} คน===`
                        : "===บุคคลที่เป็นผู้รับสวัสดิการ (ต่อ)===";
                replyMessage.push({
                    type: "text",
                    text: `${header}\n${iws.join("\n")}`,
                });
            });
        }

        return replyMessage;
    }
}

export function TypeFormatter(PInfo: IDCardData[]): Promise<Message> {
    return new Promise(async (resolve, reject) => {
        const BotConfigCollection = new MongoDBCrud("botconfig");
        await BotConfigCollection.connect();
        const Botsconfig: BotConfigData[] = (await BotConfigCollection.find(
            {},
        )) as unknown as BotConfigData[];
        const BehaviorsIncluded = Botsconfig[0].behaviorsIncluded;
        let TextResult: string = "";
        if (PInfo.length === 1) {
            const data: {
                [key: string]: Date | boolean | string | number | null | 0 | 1;
            } = { ...PInfo[0] };
            for (const key in data) {
                if (data[key] === null) {
                    data[key] = "-";
                }
            }
            let Update: Date | string = "";
            data.Last_Upd_Date === "-"
                ? (Update = data.Create_Date as Date | string)
                : (Update = data.Last_Upd_Date as Date | string);
            TextResult =
                `==ประวัติ/พฤติกรรม==` +
                `\nหมายเลขบัตรประชาชน : ${data.หมายเลขบตรประชาชน_}` +
                `\nชื่อ-สกุล : ${data.คำนำหนา_} ${data.ชอภาษาไทย_} ${data.นามสกลภาษาไทย_}` +
                `\nพฤติกรรมย่อ : ${data.พฤตกรรมบคคล_}` +
                `\nรายละเอียดอื่นๆ : ${data.รายละเอยดอนๆ_}` +
                `\nปรับปรุงข้อมูลเมื่อ : ${date(Update)}`;
            resolve({
                type: "text",
                text: TextResult,
            });
        } else {
            const isWelfare = PInfo.filter(
                (message) =>
                    message.รายละเอยดอนๆ_ &&
                    message.รายละเอยดอนๆ_.includes(`โครงการสวัสดิการแห่งรัฐ`) &&
                    message.พฤตกรรมบคคล_ === null,
            );
            const onlyTravel = PInfo.filter(
                (message) => message.traveling === true,
            );
            const notWelfare = PInfo.filter(
                (message) =>
                    !isWelfare.includes(message) &&
                    !onlyTravel.includes(message),
            );

            let multiId = [];
            let textArrs = [];
            let nw = [],
                ot = [],
                iw = [];

            for (const message of notWelfare) {
                textArrs.push(`[ID] : ${message.หมายเลขบตรประชาชน_}`);

                const a = message.พฤตกรรมบคคล_ ?? "";
                const b = message.รายละเอยดอนๆ_ ?? "";
                const icons: string[] = [];
                const behaviors = a + b;

                BehaviorsIncluded.forEach((behavior) => {
                    const regex = new RegExp(behavior.behavior, "g"); // Match the behavior name
                    const matches = behaviors.match(regex);
                    if (matches) {
                        icons.push(
                            ...Array(matches.length).fill(behavior.icon),
                        );
                    }
                });

                const newIcons = [...new Set(icons)];
                const iconString = newIcons.join(" ");
                if (iconString && newIcons.length > 0) {
                    nw.push(`${message.หมายเลขบตรประชาชน_} : ${iconString}`);
                }
            }
            for (const message of onlyTravel) {
                textArrs.push(`[#ID] : ${message.หมายเลขบตรประชาชน_}`);
                ot.push(`[#ID] : ${message.หมายเลขบตรประชาชน_}`);
            }
            for (const message of isWelfare) {
                textArrs.push(`[*ID] : ${message.หมายเลขบตรประชาชน_}`);
                iw.push(`[*ID] : ${message.หมายเลขบตรประชาชน_}`);
            }
            multiId = notWelfare.concat(isWelfare).concat(onlyTravel);

            function countIcons(str: string) {
                const match = str.match(/: (.+)/);

                if (match) {
                    const icons = match[1].split(" ");
                    return icons.filter((icon) => icon !== "-").length;
                } else {
                    // Handle the case where the regular expression does not match
                    return 0;
                }
            }

            // Sort the data using the custom sorting function
            nw.sort((a, b) => {
                const countA = countIcons(a);
                const countB = countIcons(b);

                if (countA === countB) {
                    // If the counts are equal, use a standard lexicographic sort
                    return a.localeCompare(b);
                } else {
                    // Sort by the number of icons in descending order
                    return countB - countA;
                }
            });

            const le = multiId.length;

            const replyMessage: Message = [];
            // define symbol
            const groupSize = 200;

            // Check and add the "le" message
            if (le) {
                replyMessage.push({
                    type: "text",
                    text: `พบในระบบ ${le} คน`,
                });
                const symbols = BehaviorsIncluded.map(
                    (behavior) => `${behavior.icon} : ${behavior.behavior}`,
                ).join(" | ");
                replyMessage.push({
                    type: "text",
                    text: `===สัญลักษณ์===\n${symbols}`,
                });
            }

            const groupednwArrays = groupArray(nw, groupSize);
            if (groupednwArrays.length > 0) {
                groupednwArrays.forEach((nws, index) => {
                    const header =
                        index === 0
                            ? `===บุคคลต้องตรวจสอบเพิ่มเติม ${nw.length} คน===`
                            : "===บุคคลต้องตรวจสอบเพิ่มเติม (ต่อ)===";
                    replyMessage.push({
                        type: "text",
                        text: `${header}\n${nws.join("\n")}`,
                    });
                });
            }

            // Check and add the "ot" message if it's not an empty array
            const groupedotArrays = groupArray(ot, groupSize);
            if (groupedotArrays.length > 0) {
                groupedotArrays.forEach((ots, index) => {
                    const header =
                        index === 0
                            ? `===บุคคลที่เดินทาง ${ot.length} คน===`
                            : "===บุคคลที่เดินทาง (ต่อ)===";
                    replyMessage.push({
                        type: "text",
                        text: `${header}\n${ots.join("\n")}`,
                    });
                });
            }

            // Check and add the "iw" message if it's not an empty array
            const groupediwArrays = groupArray(iw, groupSize);
            if (groupediwArrays.length > 0) {
                groupediwArrays.forEach((iws, index) => {
                    const header =
                        index === 0
                            ? `===บุคคลที่เป็นผู้รับสวัสดิการ ${iw.length} คน===`
                            : "===บุคคลที่เป็นผู้รับสวัสดิการ (ต่อ)===";
                    replyMessage.push({
                        type: "text",
                        text: `${header}\n${iws.join("\n")}`,
                    });
                });
            }

            resolve(replyMessage);
        }
    });
}
