import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const URL_CONNNECT = await mongoose.connect("mongodb://root:root@172.18.0.2:27017/rerva")
        console.log(">>>DB is connected!")
    } catch (error) {
        console.log(error)
        
    }
}

export default connectDB
