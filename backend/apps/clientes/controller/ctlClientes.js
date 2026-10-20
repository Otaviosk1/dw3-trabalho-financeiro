const mdlClientes = require("../model/mdlClientes");

const GetAllClientes = (req, res) =>
  (async () => {
    let registro = await mdlClientes.GetAllClientes();
    res.json({ status: "ok", registro: registro });
  })();

const GetClienteByID = (req, res) =>
  (async () => {
    const clienteID = parseInt(req.params.clienteid);
    let registro = await mdlClientes.GetClienteByID(clienteID);
    res.json({ status: "ok", registro: registro });
  })();

const InsertCliente = (request, res) =>
  (async () => {
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.InsertCliente(clienteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const UpdateCliente = (request, res) =>
  (async () => {
    const clienteID = parseInt(request.params.clienteid);
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.UpdateCliente(clienteID, clienteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const DeleteCliente = (request, res) =>
  (async () => {
    const clienteID = parseInt(request.params.clienteid);
    let { msg, linhasAfetadas } = await mdlClientes.DeleteCliente(clienteID);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  GetAllClientes,
  GetClienteByID,
  InsertCliente,
  UpdateCliente,
  DeleteCliente,
};