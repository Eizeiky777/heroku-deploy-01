// const cool = require('cool-ascii-faces');
// const express = require('express');
// const path = require('path');
// const PORT = process.env.PORT || 5000;

// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .get('/cool', (req, res) => res.send(cool()))
//   .get('/times', (req, res) => {
//       let result = '';
//       const times = process.env.TIMES || 5;
//       for (i = 0; i < times; i++) {
//         result += i + ' ';
//       }
//       return res.send(result);
//   })
//   .get('/db', async (req, res) => {
//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM test_table');
//       const results = { 'results': (result) ? result.rows : null};
//       res.render('pages/db', results );
//       client.release();
//     } catch (err) {
//       console.error(err);
//       res.send("Error " + err);
//     }
//   })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));


const http = require('http');
const app = require('./app');

const { env } = process;
const svc = env.SVC_NAME || 'Heroku';
const host = env.HOST || 'localhost';
const port = Number(env.PORT) || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Backend server Heroku is running at localhost:${port}`);
});