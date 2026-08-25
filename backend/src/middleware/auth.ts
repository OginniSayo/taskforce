import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const authMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {
    // Extract the token from the request headers
    const authHeader = req.headers.authorization;

        // Check if the authorization header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Not Authorized. No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Malformed authorization header" });
      return;
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, JWT_SECRET ) as { id: string };

    (req as Request & { user: { id: string } }).user = { id: decoded.id };
    next();

  } catch(error) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid token'
    res.status(401).json({ success: false, message: errorMessage });
  }
}

export default authMiddleware;