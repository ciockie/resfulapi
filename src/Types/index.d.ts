import { Express } from "express";

import * as LineModel from "./line.model";

type Message = LineModel.Message | LineModel.Message[];

type InfraMessage = LineModel.Message & {
    id: string;
    replyToken: string;
    source: LineModel.EventSource;
};

interface LineConfig {
    channelAccessToken: string;
    channelSecret: string;
}

export interface LineBotHandlerInterface {
    middleware(): any;
    replyMessage(replyToken: string, message: Message): Promise<any>;
    pushMessage(userId: string, message: Message): Promise<any>;
    downloadContent(messageId: string): Promise<Buffer | null>;
    getProfile(userId: string): Promise<any>;
    getGroupAllMemberProfile(groupId: string): Promise<any>;
}

interface BotCommands {
    CommandName: string;
    CommandDescription: string;
    CommandFunction: (
        args: string[],
        userId: string,
    ) => Promise<CommandResponse>;
}

interface Events {
    EventName: string;
    EventDescription: string;
    EventType: string;
    execute: (
        message: InfraMessage,
        replytoken: string,
        command: Map<string, BotCommands>,
    ) => void; // Define the return type as needed
}

interface RouteDefinition {
    HTTPName: string;
    method: string;
    path: string;
    RouteDescription: string;
    execute: (
        app: Express,
        BotCommands: Map<string, BotCommands>,
        Events: Map<string, Events>,
    ) => void;
}

//bot config db
interface Behavior {
    behavior: string;
    icon: string;
}

interface Commands {
    name: string;
    status: boolean;
    description: string;
}

interface BotConfigData {
    behaviors: Behavior[];
    commands: Commands[];
}

// id card
type Bit = 0 | 1;

interface IDCardData {
    Unique_ID: string;
    AltEntity: string | null;
    Create_Date: Date | null;
    Create_User: string | null;
    IconColour: string | null;
    Last_Upd_Date: Date | null;
    Last_Upd_User: string | null;
    Record_Status: number;
    SCC: string | null;
    Status_Binding: string | null;
    เชอชาต_: string | null;
    กรปเลอด_: string | null;
    คำนำหนา_: string | null;
    ชอเดมชอเรยก_: string | null;
    ชอภาษาไทย_: string | null;
    ชอภาษาองกฤษ_: string | null;
    ตำหน_: string | null;
    นามสกลภาษาไทย_: string | null;
    นามสกลภาษาองกฤษ_: string | null;
    พฤตกรรมบคคล_: string | null;
    รปพรรณสนฐาน_: string | null;
    รปภาพ_: string | null;
    รปภาพ__Binding: string | null;
    รายละเอยดอนๆ_: string | null;
    วนเกด_: string | null;
    ศาสนา_: string | null;
    สญชาต_: string | null;
    สถานทเกด_: string | null;
    สถานภาพ_: string | null;
    หมายเลขบตรประชาชน_: string | null;
    อาชพ_: string | null;
    position_: string | null;
    บญช_ทกร: Bit;
    บญชเปาหมาย_: Bit;
    มหมายจบ_: Bit;
    หลบหน_: Bit;
    จบกม_: Bit;
    เสยชวต_: Bit;
    ปลดหมาย_: Bit;
    ดำเนนคดคมขง_: Bit;
    เคลอนไหว_: Bit;
    traveling: boolean;
}

interface CommandResponse {
    status: boolean;
    message: IDCardData[] | string;
}

//bot config page & api
interface Behavior {
    behavior: string;
    icon: string;
}

interface Commands {
    name: string;
    status: boolean;
    description: string;
}

interface BotConfigData {
    behaviorsIncluded: Behavior[];
    commands: Commands[];
}
