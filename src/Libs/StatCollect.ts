import { MongoDBCrud } from "@/Libs/Mongo";

export async function StatCollect(
    userId: string,
    Command: string,
    Args: string,
): Promise<void> {
    const TimeOfThailand = new Date();
    TimeOfThailand.setHours(TimeOfThailand.getHours() + 7);
    const stat = {
        time: TimeOfThailand,
        userId,
        command: Command,
        args: Args,
    };
    try {
        const StatCollection = new MongoDBCrud("statistics");
        await StatCollection.connect();
        await StatCollection.insert(stat);
    } catch (error) {
        console.log(error);
    }
}
