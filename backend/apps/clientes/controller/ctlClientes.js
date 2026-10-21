const mdlClientes = require("../model/mdlClientes");

// Lista todos os clientes ativos
const GetAllClientes = async (req, res) => {
  try {
    const registros = await mdlClientes.GetAllClientes();

    // Normaliza os campos para consumo na view
    const registrosFormatados = registros.map(c => ({
      clienteid: c.clienteid,
      id: c.clienteid,
      codigo: c.codigo,
      nome: c.nome,
      endereco: c.endereco,
      ativo: c.ativo === true || c.ativo === 1 || c.ativo === 'true',
      deleted: Boolean(c.deleted),
      removido: Boolean(c.deleted)
    }));

    res.json({
      status: "ok",
      registro: registrosFormatados,
      registros: registrosFormatados
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Busca registro de cliente por ID
const GetClienteByID = async (req, res) => {
  try {
    const clienteID = parseInt(req.params.clienteid || req.params.id || req.query.clienteId || req.query.clienteid, 10);
    const registro = await mdlClientes.GetClienteByID(clienteID);

    if (!registro) {
      return res.status(404).json({ status: "error", message: "Cliente não encontrado." });
    }

    res.json({ status: "ok", registro });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Inclusao de novo cliente
const InsertCliente = async (request, res) => {
  try {
    const clienteREG = request.body;
    const { msg, linhasAfetadas } = await mdlClientes.InsertCliente(clienteREG);
    res.json({ status: msg, linhasAfetadas });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Atualizacao dos dados cadastrais do cliente
const UpdateCliente = async (request, res) => {
  try {
    const clienteID = parseInt(request.params.clienteid || request.params.id || request.query.clienteId, 10);
    const clienteREG = request.body;
    const { msg, linhasAfetadas } = await mdlClientes.UpdateCliente(clienteID, clienteREG);
    res.json({ status: msg, linhasAfetadas });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Exclusao logica do cliente
const DeleteCliente = async (request, res) => {
  try {
    const clienteID = parseInt(request.params.clienteid || request.params.id || request.query.clienteId, 10);
    const { msg, linhasAfetadas } = await mdlClientes.DeleteCliente(clienteID);
    res.json({ status: msg, linhasAfetadas });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  GetAllClientes,
  GetClienteByID,
  InsertCliente,
  UpdateCliente,
  DeleteCliente
};