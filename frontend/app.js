// Importacao dos modulos e dependencias principais
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
require('dotenv').config();

// Importacao dos roteadores da aplicacao
const router = require('./routes/router');
const clientesRouter = require('./routes/rtClientes'); 
const contasReceberRouter = require('./routes/rtContasReceber');

// Inicializacao da aplicacao Express e definicao da porta
const app = express();
const port = process.env.PORT || 40100;

// Configuracao do Nunjucks para renderizacao dos templates HTML
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: false
});
app.set('view engine', 'html');

// Servico de arquivos estaticos e configuracao de parsers para requisicoes
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuracao de sessao para armazenamento do token de autenticacao
app.use(session({
  secret: 'chave_secreta_frontend_dw3',
  resave: false,
  saveUninitialized: true
}));

// Ativacao e prefixacao das rotas dos modulos
app.use(router);
app.use('/clientes', clientesRouter);
app.use('/contas_receber', contasReceberRouter);

// Inicializacao do servidor HTTP
app.listen(port, () => {
  console.log(`Servidor Front-End rodando na porta ${port}`);
});