if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express')
const cors = require('cors');
const { router } = require('./routes/index');
const app = express()
const port = 3000

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  database: 'postgres1',
  user: 'postgres1',
  password: 'postgres1',
  port: 5432,
});
app.use(express.json());

app.use(cors());
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
