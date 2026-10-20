const db = require("../../../database/databaseconfig");

const GetAllClientes = async () => {
  return (
    await db.query(
      "SELECT clienteid, codigo, nome, endereco, ativo, deleted FROM clientes WHERE deleted = false ORDER BY nome ASC"
    )
  ).rows;
};

const GetClienteByID = async (clienteIDPar) => {
  return (
    await db.query(
      "SELECT clienteid, codigo, nome, endereco, ativo, deleted FROM clientes WHERE clienteid = $1 AND deleted = false",
      [clienteIDPar]
    )
  ).rows;
};

const InsertCliente = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO clientes (codigo, nome, endereco, ativo, deleted) VALUES ($1, $2, $3, $4, $5)",
        [
          clienteREGPar.codigo,
          clienteREGPar.nome,
          clienteREGPar.endereco,
          clienteREGPar.ativo,
          clienteREGPar.deleted || false,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes InsertCliente] " + error.detail;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const UpdateCliente = async (clienteIDPar, clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE clientes SET codigo = $2, nome = $3, endereco = $4, ativo = $5, deleted = $6 WHERE clienteid = $1",
        [
          clienteIDPar,
          clienteREGPar.codigo,
          clienteREGPar.nome,
          clienteREGPar.endereco,
          clienteREGPar.ativo,
          clienteREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes UpdateCliente] " + error.detail;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const DeleteCliente = async (clienteIDPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE clientes SET deleted = true WHERE clienteid = $1",
        [clienteIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes DeleteCliente] " + error.detail;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllClientes,
  GetClienteByID,
  InsertCliente,
  UpdateCliente,
  DeleteCliente,
};