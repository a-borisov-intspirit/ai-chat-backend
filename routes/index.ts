const express = require('express');
const router = express.Router();
const messages = require('./messages');
const auth = require('./auth');

router.use('/auth', auth);
router.use('/user_messages', messages);

module.exports = { router };