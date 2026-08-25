import { Request, Response } from "express";
import User from "../models/userModel";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";

// Precomputed bcrypt hash for the password "dummy" (10 salt rounds)
// This must be a structurally valid bcrypt string so the library performs full work
const DUMMY_HASH = '$2b$10$wI1.w1b9BvYkC5r/Y8a9BeK7S3b2v1m0g9f8e7d6c5b4a3z2y1x0w';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET

const createToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}

// REGISTER FUNCTIONALITY
const registerUser = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  
  try {
    // Get the fields from req.body and normalize the email to avoid case sensitivity issues
    const { name, email, password } = req.body;
    
    // Check if all required fields are provided
    if(!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Validate the email format using validator
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
  
    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Check if the email already exists in the database
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'User already exists'})
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    // Create a JWT token for the newly registered user
    const token: string = createToken(user._id.toString());

    // Send a success response with the token and user details
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      token, 
      user:{ 
        id: user._id.toString(), // explicitly convert ObjectId to string even though it will be serialized to string in JSON (because of res.json), but this makes it clear that we are sending a string representation of the ObjectId
        name: user.name, 
        email: user.email 
      } 
    })
    
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    res.status(500).json({ success: false, message: errorMessage });
  }
}

// LOGIN FUNCTIONALITY
const loginUser = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });

    // Determine which hash to use
    // If user is missing, target the precomputed dummy hash instead
    const hashToCompare = user ? user.password : DUMMY_HASH;

    // Execute bcrypt.compare in both code paths
    // This forces the CPU to spend identical crypto-processing time
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, hashToCompare);

    // Return a generic failure message
    // Never disclose whether the email or the password was incorrect
    if (!user || !isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create a JWT token for the logged-in user
    const token: string = createToken(user._id.toString());

    // Send a success response with the token and user details
    res.status(200).json({ 
      success: true, 
      message: 'User logged in successfully', 
      token, 
      user:{ 
        id: user._id.toString(), // explicitly convert ObjectId to string even though it will be serialized to string in JSON (because of res.json), but this makes it clear that we are sending a string representation of the ObjectId
        name: user.name, 
        email: user.email 
      } 
    });

  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    res.status(500).json({ success: false, message: errorMessage });
  }
}

// Get Current User

const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized to access this route",
      });
      return;
    }
    // Find the user by ID from the request object and select only the name and email fields
    const user = await User.findById(req.user.id).select('name email');

    // If the user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
    res.status(500).json({ success: false, message: errorMessage });
  }
}

// Update User Profile
const updateProfile = async (req: AuthRequest<{}, {}, Omit<RegisterBody, "password">>, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized to access this route",
      });
      return;
    }

    // Destructure the name and email fields from the request body
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email fields required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Validate the email format using validator
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Valid email required" });
    }

    // Check if the new email is already in use by another user (excluding the current user)
    const userExists = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user.id } });

    if (userExists) {
      return res.status(409).json({ success: false, message: "Email already in use by another account" });
    }

    // Update the user's profile with the new name and email, returning the updated user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email: normalizedEmail },
      { new: true, runValidators: true }
    ).select('name email');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, updatedUser });

  } catch (error) {
    // Handle duplicate key error (e.g., if the email is already in use)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
  
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

// Change Password Functionality
const updatePassword = async (req: AuthRequest<{}, {}, UpdatePasswordBody>, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized to access this route",
    });
    return;
  }
  
  try {
    // Destructure the currentPassword and newPassword fields from the request body
    const { currentPassword, newPassword } = req.body;

    // Check if both currentPassword and newPassword are provided and if newPassword is greater than 8 characters
    if(!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide current and new password" })
    }

    if(newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" })
    }

    // Get the user with the id provided by the auth middleware and select the password
    const user = await User.findById(req.user.id).select("password");
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the currentPassword matches with the stored passwored for the user
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Reject if new password equals current password
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: "New password must be different from current password" });
    }

    // Update the user's password to be the hashed value of the newPassword
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save()
    return res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    res.status(500).json({ success: false, message: errorMessage });
  }
}


export { registerUser, loginUser, getCurrentUser, updateProfile, updatePassword };