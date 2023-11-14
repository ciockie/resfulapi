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

interface CommandResponse {
    status: boolean;
    message: string;
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
