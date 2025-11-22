import express from "express"
import morgan from "morgan"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import userRoutes from '../backend/routes/userroutes.js'
import cors from 'cors';
dotenv.config();

const app= express()
const PORT=process.env.PORT;
app.use(cors());

app.use(express.json());
app.use(morgan('dev'))


mongoose.connect(process.env.MONGODB_URl)
.then(()=>console.log("mongodb connected successfully"))
.catch((err)=>console.log(err))
app.use('/',userRoutes)



app.listen(5000,()=>{
   console.log("server running on port 5000")
})



