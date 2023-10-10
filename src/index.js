import app from "./app.js";
import connectDB from "./db.js";
import {PORT} from './app.js'


connectDB() 
app.listen(PORT)
