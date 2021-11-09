/* eslint-disable no-console */
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/user-model');


exports.sequelizeQueryRaw = async (req, res) => {
  const myQuery = req.body.queries;

  try {
    const data = await sequelize.query(
      //   'SELECT * FROM projects WHERE status IN(:status)',
      myQuery,
      {
        // replacements: { status: ['active', 'inactive'] },
        type: QueryTypes.SELECT,
      },
    );

    return res.status(200).send({ status: 200, message: data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.stack });
  }
};
