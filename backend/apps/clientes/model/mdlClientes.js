const db = require("../../../database/databaseconfig");

// Retorna todos os clientes ativos ordenados por nome
const GetAllClientes = async () => {
  const query = `
    SELECT clienteid, codigo, nome, endereco, ativo, deleted, deleted AS removido 
    FROM clientes 
    WHERE (deleted = false OR deleted IS NULL)
    ORDER BY nome ASC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Busca cliente por ID
const GetClienteByID = async (clienteIDPar) => {
  const query = `
    SELECT clienteid, codigo, nome, endereco, ativo, deleted, deleted AS removido 
    FROM clientes 
    WHERE clienteid = $1 AND (deleted = false OR deleted IS NULL);
  `;
  const { rows } = await db.query(query, [clienteIDPar]);
  return rows[0];
};

// Insere novo cliente validando unicidade de codigo
const InsertCliente = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    // Valida duplicidade de codigo
    const checkCodigo = await db.query(
      "SELECT clienteid FROM clientes WHERE codigo = $1 AND (deleted = false OR deleted IS NULL)",
      [clienteREGPar.codigo]
    );

    if (checkCodigo.rows.length > 0) {
      return { msg: "Código de cliente já cadastrado!", linhasAfetadas: 0 };
    }

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
    msg = "[mdlClientes InsertCliente] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// Atualiza dados cadastrais do cliente
const UpdateCliente = async (clienteIDPar, clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    // Impede duplicidade de codigo com outro registro
    const checkCodigo = await db.query(
      "SELECT clienteid FROM clientes WHERE codigo = $1 AND clienteid <> $2 AND (deleted = false OR deleted IS NULL)",
      [clienteREGPar.codigo, clienteIDPar]
    );

    if (checkCodigo.rows.length > 0) {
      return { msg: "Código de cliente já cadastrado para outro registro!", linhasAfetadas: 0 };
    }

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
    msg = "[mdlClientes UpdateCliente] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// Exclusao logica com validacao de integridade referencial
const DeleteCliente = async (clienteIDPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    // Valida vinculo com contas a receber ativas
    const contasVinculadas = await db.query(
      "SELECT contareceberid FROM contas_a_receber WHERE clienteid = $1 AND (removido = false OR removido IS NULL) LIMIT 1",
      [clienteIDPar]
    );

    if (contasVinculadas.rows.length > 0) {
      return { msg: "Não é possível remover: Este cliente possui contas a receber registadas.", linhasAfetadas: 0 };
    }

    linhasAfetadas = (
      await db.query(
        "UPDATE clientes SET deleted = true WHERE clienteid = $1",
        [clienteIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes DeleteCliente] " + (error.detail || error.message);
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