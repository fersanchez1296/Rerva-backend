import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const URL_CONNNECT = await mongoose.connect("mongodb://root:root@mongodb:27017/rerva?authSource=admin")
        console.log(">>>DB is connected!")
    } catch (error) {
        console.log(error)
        
    }
}

export default connectDB
