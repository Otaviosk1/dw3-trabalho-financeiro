const express = require("express");
const routerApp = express.Router();
const appLogin = require("../apps/login/controller/ctlLogin");

routerApp.get("/", (req, res) => {
  res.send("API do Sistema Financeiro Operacional!");
});

// Rotas de Autenticação
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

module.exports = routerApp;