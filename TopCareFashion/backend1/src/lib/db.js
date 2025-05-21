import mongoose from "mongoose";

export const connectDB = async () => { //async function to connect to db
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); // assign using variable
        console.log(`Database connected ${conn.connection.host}`); // put as host to see terminal
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1); // exit with failure
    }
};