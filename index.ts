if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cookieParser = require("cookie-parser");
const express = require('express')
const cors = require('cors');
const { router } = require('./routes/index');
const app = express()
const port = 3000

app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
