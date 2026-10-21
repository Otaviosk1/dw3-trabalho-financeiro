const express = require('express');
const router = express.Router();
const ctlLogin = require('../public/apps/login/controller/ctlLogin');

// Rotas de autenticacao
router.get('/Login', ctlLogin.Login);
router.post('/Login', ctlLogin.RealizaLogin);
router.get('/Logout', ctlLogin.Logout);

// Dashboard principal
router.get('/', (req, res) => {
  // Redireciona para o login caso nao haja sessao ativa
  if (!req.session || !req.session.token) {
    return res.redirect('/Login');
  }

  res.render('index', {
    title: 'Home',
    token: req.session.token,
    showNavbar: true,
    activeMenu: 'home'
  });
});

module.exports = router;