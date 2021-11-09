/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const cool = require('cool-ascii-faces');
// const { Sequelize, DataTypes, Model } = require('sequelize');
const { v1: uuidV1 } = require('uuid');
// // Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'path/to/database.sqlite'
// });

// const {
//   HOST, DATABASE, USER, PASSWORD_DB, PORT_DB,
// } = process.env;

// // Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize({
//   database: DATABASE,
//   username: USER,
//   password: PASSWORD_DB,
//   host: HOST,
//   port: PORT_DB,
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// const User = sequelize.define('people', {
//   // Model attributes are defined here
//   id: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//   },
//   class: {
//     type: DataTypes.INTEGER,
//   },
// }, {
//   paranoid: true,
// });

// (async () => {
//   // delete existing
//   // await User.sync({ force: true });
//   // not deleting existing
//   await User.sync();
// })();

const { Pool } = require('pg');
const { User, sequelize } = require('../models/user-model');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


exports.getListusers = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { results: (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.log(err);
    return res.send(`Error ${err}`);
  }

  return true;
};

exports.renderIndex = async (req, res) => res.render('pages/index');

exports.coolIcon = async (req, res) => res.send(cool());

exports.getTimes = async (req, res) => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (let i = 0; i < times; i += 1) {
    result += `${i} `;
  }
  return res.send(result);
};

exports.sequelizeGetListUser = async (req, res) => {
  const attributes = {
    attributes: ['id', 'name', 'class'],
  };

  try {
    const users = await User.findAll(attributes);
    return res.status(200).send(users);
  } catch (err) {
    console.log('Unable to connect to the database:', err);
    return res.status(400).send(err);
  }
};

exports.sequelizeCreateUser = async (req, res) => {
  const i = uuidV1();
  const { name: n, class: c } = req.body;

  const data = {};

  if (i) data.id = i;
  if (n) data.name = n;
  if (c) data.class = c;

  // return res.send(200)
  try {
    const user = await User.create(data, { fields: ['id', 'name', 'class'] });
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.sequelizeDbTransaction = async (req, res) => {
  const i = uuidV1();
  const { name: n, class: c } = req.body;

  const data = {};

  if (i) data.id = i;
  if (n) data.name = n;
  if (c) data.class = c;

  // return res.send(200)
  try {
    // Result is whatever you returned inside the transaction
    const result = await sequelize.transaction(async (t) => {
      // step 1
      // return total deletion
      const destroyUser = await User.destroy({ where: { id: '98d28540-4069-11ec-9253-67d25a9b20ae' }, transaction: t });
      console.log('🚀 ~ file: user.js ~ line 144 ~ result ~ destroyUser', destroyUser);

      // Cause rollback
      // eslint-disable-next-line no-constant-condition
      if (true) {
        throw new Error('Rollback initiated');
      }

      // step 2
      const createUser = await User.create(data, { transaction: t });
      return createUser;
    });

    // In this case, an instance of Model
    console.log('🚀 ~ file: user.js ~ line 157 ~ exports.sequelizeDbTransaction= ~ result', result);
    return res.status(200).send({ status: 200, message: result });
  } catch (err) {
    // Rollback transaction if any errors were encountered
    console.log(1, err.name);
    console.log(2, err.message);
    console.log(3, err.status);
    console.log(4, err.stack);
    return res.status(400).send({ status: 400, message: err.stack });
  }
};

exports.sequelizeSoftDelete = async (req, res) => {
  const { id } = req.params;
  try {
    // const post = await User.create({ title: 'test' });
    // console.log(post instanceof Post); // true
    const soft = await User.destroy({ where: { id } }); // Would just set the `deletedAt` flag
    return res.status(200).send({ status: 200, message: soft });
  } catch (err) {
    console.log('🚀 ~ file: user.js ~ line 183 ~ exports.sequelizeSoftDelete ~ err', err);
    return res.status(400).send({ status: 400, message: err.stack });
  }
};

exports.sequelizeForceDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const force = await User.destroy({ where: { id }, force: true });
    return res.status(200).send({ status: 200, message: force });
  } catch (err) {
    console.log('🚀 ~ file: user.js ~ line 194 ~ exports.sequelizeForceDelete ~ err', err);
    return res.status(400).send({ status: 400, message: err.stack });
  }
};

exports.sequelizeRestore = async (req, res) => {
  const { id } = req.params;
  try {
    const restore = await User.restore({ where: { id } });
    return res.status(200).send({ status: 200, message: restore });
  } catch (err) {
    console.log('🚀 ~ file: user.js ~ line 205 ~ exports.sequelizeRestoreDelete ~ err', err);
    return res.status(400).send({ status: 400, message: err.stack });
  }
};

exports.sequelizeRetrieveSoftDelete = async (req, res) => {
  try {
    const userSoft = await User.findAll({
      paranoid: false,
    });
    return res.status(200).send({ status: 200, message: userSoft });
  } catch (err) {
    console.log('🚀 ~ file: user.js ~ line 217 ~ exports.sequelizeRetrieveSoftDelete ~ err', err);
    return res.status(400).send({ status: 400, message: err.stack });
  }
};
