const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

//Habilita cors
app.use(cors());

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Carrega as rotas
const mainRoute = require('./app-router');
const automoveisRoute = require('./automoveis/automoveis-route');

app.use('/', mainRoute);
app.use('/automoveis', automoveisRoute);

module.exports = app;