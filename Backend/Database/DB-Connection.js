import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { ApiError } from "../utils/ApiErrorResponse.js";

const ConnectDB = async () => {
    try {
        console.log(`Connecting to MongoDB with URI: ${process.env.MONGODB_URI}/${DB_NAME}`);
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected: DB HOST ${connection.connection.host}`);
    } catch (error) {
            throw new ApiError(500, error.message);
    }
}


export default ConnectDB;