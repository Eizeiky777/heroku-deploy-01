/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
const {
  getListusers, renderIndex, coolIcon, getTimes, sequelizeGetListUser, sequelizeCreateUser, sequelizeDbTransaction,
} = require('../controller/user');
const { validateUser } = require('../middleware/user-middleware');


router.get('/', renderIndex);
router.get('/cool', coolIcon);
router.get('/times', getTimes);
router.get('/db', getListusers);

router.get('/sequelize-get', sequelizeGetListUser);
router.post('/sequelize-create-user', validateUser, sequelizeCreateUser);
router.post('/sequelize-db-transaction', validateUser, sequelizeDbTransaction);


module.exports = router;

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
