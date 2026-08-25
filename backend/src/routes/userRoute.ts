import express from "express";
import { registerUser, loginUser, getCurrentUser, updateProfile, updatePassword } from "../controllers/userController";
import authMiddleware from "../middleware/auth";

const userRouter: express.Router = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Private Routes
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, updatePassword);

export default userRouter;