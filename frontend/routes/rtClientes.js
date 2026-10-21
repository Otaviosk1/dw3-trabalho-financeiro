const express = require('express');
const router = express.Router();

// Middleware de autenticação com bloqueio de cache para evitar navegação pelo histórico
const verificaAutenticacao = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  
  if (req.session && req.session.token) {
    next();
  } else {
    res.redirect('/Login');
  }
};

// Listagem de clientes
router.get('/', verificaAutenticacao, (req, res) => {
  res.render('clientes/vwLstClientes', {
    title: 'Clientes',
    showNavbar: true,
    activeMenu: 'clientes',
    servidorDw3: process.env.SERVIDOR_DW3 || 'http://localhost:40000',
    token: req.session.token
  });
});

// Formulário de cadastro e edição
router.get('/form', verificaAutenticacao, (req, res) => {
  res.render('clientes/vwFormClientes', {
    title: 'Formulário de Clientes',
    showNavbar: true,
    activeMenu: 'clientes',
    servidorDw3: process.env.SERVIDOR_DW3 || 'http://localhost:40000',
    token: req.session.token
  });
});

module.exports = router;