import mongoose from "mongoose";

type connectionObject = {
    isConnect?: number;
}

const connection: connectionObject = {};

export const dbConnect = async (): Promise<void> => {
    if (connection.isConnect) {
        console.log("Already connected to database!!");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string);

        connection.isConnect = db.connections[0].readyState;
        console.log("Connected to database!!");
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit()
    }
}