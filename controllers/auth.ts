const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import type { Request, Response } from 'express';

const { executeQuery } = require('../helpers/db_connect');
const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await executeQuery(`
    INSERT INTO users (email, password)
    SELECT '${email}', '${hashedPassword}'
    WHERE NOT EXISTS (
      SELECT 1 FROM users WHERE email = '${email}'
    )
    RETURNING id;
`);
  if (result.length === 0) return res.sendStatus(409);
  res.sendStatus(200);
}

const login = async (req: any, res: Response) => {
  const { email, password } = req.body;
  const user = await executeQuery(`
    SElECT * FROM users WHERE email='${email}';
`);
  if (!user[0]) return res.status(400).send('User not found');

  const isValid = await bcrypt.compare(password, user[0].password);
  if (!isValid) return res.status(400).send('Wrong password');

  const accessToken = jwt.sign(
    { userId: user[0].id },
    process.env.ACCESS_KEY,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user[0].id },
    process.env.REFRESH_KEY,
    { expiresIn: '7d' }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });


  res.status(200).json({ accessToken, id: user[0].id });
}

const logout = async (req: any, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });
  res.sendStatus(200);
}

const refresh = async (req: any, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    console.log(user);

    const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_KEY, { expiresIn: '15m' });
    res.json({ accessToken });
  });
}

module.exports = { createUser, login, refresh, logout };