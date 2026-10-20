var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('clientes/vwLstClientes', {
    title: 'Clientes',
    showNavbar: true,
    activeMenu: 'clientes',
    servidorDw3: process.env.SERVIDOR_DW3,
    token: req.session.token // Passa o token da sessão para o HTML
  });
});

router.get('/form', function(req, res) {
  res.render('clientes/vwFormClientes', {
    title: 'Formulário de Clientes',
    showNavbar: true,
    activeMenu: 'clientes',
    servidorDw3: process.env.SERVIDOR_DW3,
    token: req.session.token // Passa o token da sessão para o formulário
  });
});

module.exports = router;