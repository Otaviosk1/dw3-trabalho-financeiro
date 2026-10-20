const express = require('express');
const router = express.Router();
const ctlLogin = require('../public/apps/login/controller/ctlLogin');

// Rotas da Tela de Login
router.get('/Login', ctlLogin.Login);
router.post('/Login', ctlLogin.RealizaLogin);
router.get('/Logout', ctlLogin.Logout);

// Rota principal (Home/Dashboard)
router.get('/', (req, res) => {
    // Se não tiver token guardado na sessão, expulsa para o login
    if (!req.session.token) {
        return res.redirect('/Login');
    }
    res.render('index', { 
        token: req.session.token,
        showNavbar: true,
        activeMenu: 'home'
    });
});

module.exports = router;