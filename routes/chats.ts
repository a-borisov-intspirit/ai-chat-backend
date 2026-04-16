const express = require('express');
const { getChats, createChat, deleteChat, getMessages, addMessage } = require('../controllers/chats');

const router = express.Router();

router.post('/', createChat);
router.get('/', getChats);
router.delete('/:id', deleteChat);
router.get('/:id', getMessages);
router.post('/:id', addMessage);

module.exports = router;