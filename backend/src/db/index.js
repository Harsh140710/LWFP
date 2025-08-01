import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)

        console.log(`MongoDB Connected ! DB Host : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDb Connection Error",error);
        process.exit(1)
    }
}

export default connectDB;
