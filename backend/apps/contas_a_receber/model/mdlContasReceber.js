const db = require("../../../database/databaseconfig");

// Retorna todas as contas a receber ativas com o nome do cliente
const getAllContasReceber = async () => {
  const query = `
    SELECT 
      cr.contareceberid,
      cr.clienteid,
      c.nome AS nome_cliente,
      cr.descricao,
      cr.valor,
      cr.datavencimento,
      cr.recebido,
      cr.removido
    FROM contas_a_receber cr
    INNER JOIN clientes c ON cr.clienteid = c.clienteid
    WHERE cr.removido = false
    ORDER BY cr.contareceberid ASC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

// Busca registro de conta por ID
const getContaReceberByID = async (id) => {
  const query = `
    SELECT 
      cr.contareceberid,
      cr.clienteid,
      c.nome AS nome_cliente,
      cr.descricao,
      cr.valor,
      cr.datavencimento,
      cr.recebido,
      cr.removido
    FROM contas_a_receber cr
    INNER JOIN clientes c ON cr.clienteid = c.clienteid
    WHERE cr.contareceberid = $1 AND cr.removido = false;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// Insere nova conta a receber
const insertContaReceber = async (conta) => {
  const query = `
    INSERT INTO contas_a_receber (clienteid, descricao, valor, datavencimento, recebido, removido)
    VALUES ($1, $2, $3, $4, $5, false)
    RETURNING *;
  `;
  const values = [
    conta.clienteid,
    conta.descricao,
    conta.valor,
    conta.datavencimento,
    conta.recebido || false
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Atualiza registro de conta a receber
const updateContaReceber = async (id, conta) => {
  const query = `
    UPDATE contas_a_receber 
    SET clienteid = $1, descricao = $2, valor = $3, datavencimento = $4, recebido = $5
    WHERE contareceberid = $6 AND removido = false
    RETURNING *;
  `;
  const values = [
    conta.clienteid,
    conta.descricao,
    conta.valor,
    conta.datavencimento,
    conta.recebido || false,
    id
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Exclusao logica da conta a receber
const deleteContaReceber = async (id) => {
  const query = `
    UPDATE contas_a_receber 
    SET removido = true 
    WHERE contareceberid = $1
    RETURNING *;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  getAllContasReceber,
  getContaReceberByID,
  insertContaReceber,
  updateContaReceber,
  deleteContaReceber
};