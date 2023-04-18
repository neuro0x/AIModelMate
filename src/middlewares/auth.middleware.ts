// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as DecodedToken;
    req.body.decoded = decoded;
    next();
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: "Token is not valid." });
  }
};
