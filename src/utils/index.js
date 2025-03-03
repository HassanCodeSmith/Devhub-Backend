import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'Qwerty@123';

export const sendResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json({ message, data });
};

export const generateToken = (data) => {
  return jwt.sign(data, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
};
