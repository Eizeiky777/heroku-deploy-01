/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const cool = require('cool-ascii-faces');
const { Sequelize, DataTypes, Model } = require('sequelize');
const { v1: uuidV1 } = require('uuid');
// // Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'path/to/database.sqlite'
// });

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize({
  database: 'd21e8ucdjcbgfp',
  username: 'bevwoiaslidvbm',
  password: '361dd96b5200772d1cb5f8a3ae9d21714b0b88019333fdf28b91e71eab7dc139',
  host: 'ec2-3-230-11-138.compute-1.amazonaws.com',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = sequelize.define('people', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  class: {
    type: DataTypes.INTEGER,
  },
}, {
  paranoid: true,
});

(async () => {
  // delete existing
  // await User.sync({ force: true });
  // not deleting existing
  await User.sync();
})();

const { Pool } = require('pg');

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
      if (true) {
        throw new Error('Rollback initiated');
      }

      // step 2
      const createUser = await User.create(data, { transaction: t });
      return createUser;
    });

    // In this case, an instance of Model
    console.log('🚀 ~ file: user.js ~ line 157 ~ exports.sequelizeDbTransaction= ~ result', result);
  } catch (err) {
    // Rollback transaction if any errors were encountered
    console.log(1, err.name);
    console.log(2, err.message);
    console.log(3, err.status);
    console.log(4, err.stack);
    return res.status(400).send({ status: 400, message: err.stack });
  }

  return true;
};
