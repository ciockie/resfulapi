import { MongoClient, Collection, Db } from "mongodb";
import { mongoURI, MONGODB_DATABASE } from "@/Libs/Conf";

//create mongoDBCrud class
export class MongoDBCrud {
    private client: MongoClient;
    private collection: Collection;

    constructor(collectionName: string) {
        this.client = new MongoClient(mongoURI);
        this.collection = this.client
            .db(MONGODB_DATABASE)
            .collection(collectionName);
    }

    //connect to mongoDB
    async connect() {
        try {
            await this.client.connect();
            //console.log("Connected to MongoDB");
        } catch (error) {
            console.log(error);
        }
    }

    //insert data to mongoDB
    async insert(data: any) {
        try {
            const result = await this.collection.insertOne(data);
            //console.log("Inserted data");
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    //find data from mongoDB
    async find(query: any) {
        try {
            const result = await this.collection.find(query).toArray();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async findOne(query: any) {
        try {
            const result = await this.collection.findOne(query);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    //update data in mongoDB
    async update(query: any, data: any) {
        try {
            const result = await this.collection.updateOne(query, {
                $set: data,
            });
            console.log("Updated data");
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    //delete data from mongoDB
    async delete(query: any) {
        try {
            const result = await this.collection.deleteOne(query);
            console.log("Deleted data");
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}

// example
// import MongoDBCrud from "@/Libs/Mongo";
// const crud = new MongoDBCrud("collectionName");
// const result = await crud.read("SELECT * FROM table");
// console.log(result);
