const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const router = require('./routes/router');

const app = express();
const port = process.env.PORT || 40000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Rotas da API
app.use(router);

// Inicializacao do servidor
app.listen(port, () => {
  console.log(`Servidor Back-End rodando na porta ${port}`);
});