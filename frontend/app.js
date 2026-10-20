const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
require('dotenv').config();

const router = require('./routes/router');
const clientesRouter = require('./routes/rtClientes'); // <-- Adicionado: Importa as rotas de clientes

const app = express();
const port = process.env.PORT || 40100;

// Configuração do Nunjucks para renderizar HTML
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: false
});
app.set('view engine', 'html');

// Configurações de pastas públicas e parser
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da Sessão no Front-End
app.use(session({
    secret: 'chave_secreta_frontend_dw3',
    resave: false,
    saveUninitialized: true
}));

// Ativar Rotas
app.use(router);
app.use('/clientes', clientesRouter); // <-- Adicionado: Ativa o prefixo /clientes para o seu módulo

app.listen(port, () => {
    console.log(`Servidor Front-End rodando na porta ${port}`);
});