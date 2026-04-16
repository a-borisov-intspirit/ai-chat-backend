const express = require('express');
const { login, createUser, refresh, logout } = require('../controllers/auth');

const router = express.Router();

router.post('/create', createUser);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router; 