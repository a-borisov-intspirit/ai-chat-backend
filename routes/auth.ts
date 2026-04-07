const express = require('express');
const { login, createUser } = require('../controllers/auth');

const router = express.Router();

router.post('/create', createUser);
router.post('/login', login);

module.exports = router;