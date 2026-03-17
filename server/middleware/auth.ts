import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const authMiddleware = (token: string): AuthUser | null => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (err) {
    return null;
  }
};

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
