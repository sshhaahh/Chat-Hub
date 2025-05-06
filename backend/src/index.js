import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import cookieParser from "cookie-parser"


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())

const PORT= process.env.PORT;


app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)


app.listen(PORT,()=>{
    console.log(`Server run at ${PORT}.`);
    connectDb();
}) 