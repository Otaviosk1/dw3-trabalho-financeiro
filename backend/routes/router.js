const express = require("express");
const routerApp = express.Router();
const appLogin = require("../apps/login/controller/ctlLogin");
const appClientes = require("../apps/clientes/controller/ctlClientes");
const appContasReceber = require("../apps/contas_a_receber/controller/ctlContasReceber");

// Rota de status da API
routerApp.get("/", (req, res) => {
  res.send("API do Sistema Financeiro Operacional!");
});

// Autenticacao
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// Clientes
routerApp.get("/getAllClientes", appLogin.AutenticaJWT, appClientes.GetAllClientes);
routerApp.get("/getClienteByID/:clienteid", appLogin.AutenticaJWT, appClientes.GetClienteByID);
routerApp.post("/insertCliente", appLogin.AutenticaJWT, appClientes.InsertCliente);
routerApp.put("/updateCliente/:clienteid", appLogin.AutenticaJWT, appClientes.UpdateCliente);
routerApp.delete("/deleteCliente/:clienteid", appLogin.AutenticaJWT, appClientes.DeleteCliente);

// Contas a Receber
routerApp.get("/getAllContasReceber", appLogin.AutenticaJWT, appContasReceber.getAllContasReceber);
routerApp.get("/getContaReceberByID/:contareceberid", appLogin.AutenticaJWT, appContasReceber.getContaReceberByID);
routerApp.post("/insertContaReceber", appLogin.AutenticaJWT, appContasReceber.insertContaReceber);
routerApp.put("/updateContaReceber/:contareceberid", appLogin.AutenticaJWT, appContasReceber.updateContaReceber);
routerApp.delete("/deleteContaReceber/:contareceberid", appLogin.AutenticaJWT, appContasReceber.deleteContaReceber);

module.exports = routerApp;