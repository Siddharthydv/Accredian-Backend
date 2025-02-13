import express from 'express'
import dotenv from 'dotenv'
import { referralRouter } from './routers/router';
import { authMiddleware } from './authMiddleware';
import router from './routers/userRouter';
import cookieParser from "cookie-parser"
import cors from 'cors'
dotenv.config();
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
      origin: process.env.ALLOWED_URL || "http://localhost:3001", // Allow only this origin
      credentials: true, // If using cookies or authentication headers
    })
  );
app.get('healthy',(req,res)=>{
  res.json("healthy")
})
app.use('/user',router)
app.use('/referral',authMiddleware,referralRouter);













app.listen(3000,()=>{
    console.log(`running on port ${process.env.PORT}`)
})