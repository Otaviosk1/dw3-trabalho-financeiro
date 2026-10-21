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

// Listagem de contas a receber
router.get('/', verificaAutenticacao, (req, res) => {
  res.render('contas_receber/vwLstContasReceber', {
    title: 'Contas a Receber',
    showNavbar: true,
    activeMenu: 'contas_receber',
    servidorDw3: process.env.SERVIDOR_DW3 || 'http://localhost:40000',
    token: req.session.token
  });
});

// Formulário de cadastro e edição
router.get('/form', verificaAutenticacao, (req, res) => {
  res.render('contas_receber/vwFormContasReceber', {
    title: 'Gerenciamento de Conta a Receber',
    showNavbar: true,
    activeMenu: 'contas_receber',
    servidorDw3: process.env.SERVIDOR_DW3 || 'http://localhost:40000',
    token: req.session.token
  });
});

module.exports = router;