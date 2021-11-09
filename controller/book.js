/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const cool = require('cool-ascii-faces');
// const { Sequelize, DataTypes, Model } = require('sequelize');
const { v1: uuidV1 } = require('uuid');

const { Book, sequelize } = require('../models/user-model');


exports.sequelizeCreateBook = async (req, res) => {
  const i = uuidV1();
  const { pec_user_id: p, title: t, content: c } = req.body;

  const data = {};

  if (i) data.id = i;
  if (p) data.pec_user_id = p;
  else data.pec_user_id = '21ec3c20-414d-11ec-be7f-99b3deb5b65e';

  if (t) data.title = t;
  if (c) data.content = c;

  //   return res.send(data);
  try {
    const book = await Book.create(data, { fields: ['id', 'pec_user_id', 'title', 'content'] });
    return res.status(200).send({ status: 200, message: book });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.sequelizeUpdateBook = async (req, res) => {
  const i = uuidV1();
  const { pec_user_id: p, book_id: bookId } = req.body;


  const pecUserId = p || '21ec3c20-414d-11ec-be7f-99b3deb5b65e';


  //   return res.send(data);
  try {
    const book = await Book.update({ pec_user_id: pecUserId }, {
      where: {
        id: bookId,
      },
    });
    return res.status(200).send({ status: 200, message: book });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
