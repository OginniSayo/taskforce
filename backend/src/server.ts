import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db';
import userRouter from './routes/userRoute';
import taskRouter from './routes/taskRoute';

const app = express()

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connect
connectDB()

// Routes
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('API working!')
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
  
})