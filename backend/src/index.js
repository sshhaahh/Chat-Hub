import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from 'cors'

import cookieParser from "cookie-parser"


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


const PORT= process.env.PORT;


app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
 

app.listen(PORT,()=>{
    console.log(`Server run at ${PORT}.`);
    connectDb();
}) 