const jwt = require('jsonwebtoken');
import type { Request, Response } from 'express';
const authMiddleware = (req: any, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware