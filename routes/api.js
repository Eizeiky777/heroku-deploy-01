/* eslint-disable max-len */
const express = require('express');


const router = express.Router();
const {
  getListusers, renderIndex, coolIcon, getTimes,
  sequelizeGetListUser, sequelizeCreateUser,
  sequelizeDbTransaction, sequelizeSoftDelete,
  sequelizeRestore, sequelizeForceDelete, sequelizeRetrieveSoftDelete,
} = require('../controller/user');
const { sequelizeCreateBook, sequelizeUpdateBook } = require('../controller/book');

const { validateBook } = require('../middleware/book-middleware');
const { validateUser } = require('../middleware/user-middleware');
const { sequelizeQueryRaw } = require('../controller/custom-raw');


router.get('/', renderIndex);
router.get('/cool', coolIcon);
router.get('/times', getTimes);
router.get('/db', getListusers);

// user
router.get('/sequelize-get', sequelizeGetListUser);
router.post('/sequelize-create-user', validateUser, sequelizeCreateUser);
router.post('/sequelize-db-transaction', validateUser, sequelizeDbTransaction);

router.get('/sequelize-soft-delete', sequelizeRetrieveSoftDelete);
router.delete('/sequelize-soft-delete/:id', sequelizeSoftDelete);
router.delete('/sequelize-force-delete/:id', sequelizeForceDelete);

router.post('/sequelize-restore/:id', sequelizeRestore);

// book
router.post('/sequelize-create-book', validateBook, sequelizeCreateBook);
router.put('/sequelize-update-book', sequelizeUpdateBook);

// raw
router.post('/sequelize-raw', sequelizeQueryRaw);

module.exports = router;
