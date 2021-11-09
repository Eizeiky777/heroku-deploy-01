const { Sequelize, DataTypes } = require('sequelize');

const {
  HOST, DATABASE, USER, PASSWORD_DB, PORT_DB,
} = process.env;

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize({
  database: DATABASE,
  username: USER,
  password: PASSWORD_DB,
  host: HOST,
  port: PORT_DB,
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

const Book = sequelize.define('book', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  pec_user_id: {
    type: DataTypes.STRING,
    references: { model: 'people', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',

  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  paranoid: true,
});

const syncUserModel = async () => {
  // delete existing
  //   await User.sync({ force: true });
  // not deleting existing

  await User.sync();
  await Book.sync();
};


module.exports = {
  sequelize,
  User,
  Book,
  syncUserModel,
};
