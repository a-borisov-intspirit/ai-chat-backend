const express = require('express');
const router = express.Router();
const auth = require('./auth');
const chats = require('./chats');
const authMiddleware = require('../helpers/auth_middleware');

router.use('/auth', auth);
router.use('/chats', authMiddleware, chats);

module.exports = { router };