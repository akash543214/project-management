import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (payload: { id: number; email: string }) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '30m' });
};

export const generateRefreshToken = (payload: { id: number; email: string }) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);
