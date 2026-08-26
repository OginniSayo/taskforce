import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db';
import userRouter from './routes/userRoute';
import taskRouter from './routes/taskRoute';

import path from 'path'

const app = express()

const port = process.env.PORT || 3000;

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", // allow requests from this origin (the frontend) "http://localhost:5173"
      credentials: true
    })
  );
} // enables CORS for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter)

// DB Connect
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    
  })
})