import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = (process.env.JWT_SECRET || "").trim();
  if (!secret) throw new Error("JWT_SECRET missing");

  return jwt.sign({ id: String(userId) }, secret, {
    expiresIn: process.env.JWT_EXPIRATION_TIME || "7d",
  });
};
