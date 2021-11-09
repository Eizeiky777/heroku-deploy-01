const express = require('express');


const path = require('path');

const app = express();
const cors = require('cors');

const router = require('./routes/api');

app.use(cors());

app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

module.exports = app;
