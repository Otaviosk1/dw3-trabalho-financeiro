const express = require("express");
const routerApp = express.Router();
const appLogin = require("../apps/login/controller/ctlLogin");
const appClientes = require("../apps/clientes/controller/ctlClientes");

routerApp.get("/", (req, res) => {
  res.send("API do Sistema Financeiro Operacional!");
});

// Rotas de Autenticação
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

//Rotas do Módulo de Clientes 
routerApp.get("/getAllClientes", appLogin.AutenticaJWT, appClientes.GetAllClientes);
routerApp.get("/getClienteByID/:clienteid", appLogin.AutenticaJWT, appClientes.GetClienteByID);
routerApp.post("/insertCliente", appLogin.AutenticaJWT, appClientes.InsertCliente);
routerApp.put("/updateCliente/:clienteid", appLogin.AutenticaJWT, appClientes.UpdateCliente);
routerApp.delete("/deleteCliente/:clienteid", appLogin.AutenticaJWT, appClientes.DeleteCliente);

module.exports = routerApp;