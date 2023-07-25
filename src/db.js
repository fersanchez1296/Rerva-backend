import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://rervaCuvalles:RervaCuvalles123@cluster0.0qvo09r.mongodb.net/rerva")
        console.log(">>>DB is connected!")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
