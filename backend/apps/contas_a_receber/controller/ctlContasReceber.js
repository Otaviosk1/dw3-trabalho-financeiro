const mdlContasReceber = require('../model/mdlContasReceber');

// Normaliza a extracao do ID da rota ou query
const extrairId = (req) => {
  const idBruto = req.params.id || req.params.contareceberid || Object.values(req.params)[0] || req.query.id;
  return parseInt(idBruto, 10);
};

// Retorna todas as contas ativas
const getAllContasReceber = async (req, res) => {
  try {
    const registros = await mdlContasReceber.getAllContasReceber();
    res.json({ status: 'ok', registros });
  } catch (error) {
    console.error('Erro ao buscar contas a receber:', error);
    res.status(500).json({ status: 'error', message: 'Erro interno ao buscar contas a receber.' });
  }
};

// Busca registro unico por ID
const getContaReceberByID = async (req, res) => {
  try {
    const id = extrairId(req);
    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'ID inválido ou não informado.' });

    const registro = await mdlContasReceber.getContaReceberByID(id);
    if (!registro) {
      return res.status(404).json({ status: 'error', message: 'Conta a receber não encontrada.' });
    }
    res.json({ status: 'ok', registro });
  } catch (error) {
    console.error('Erro ao buscar conta a receber por ID:', error);
    res.status(500).json({ status: 'error', message: 'Erro interno ao buscar conta a receber.' });
  }
};

// Inclusao de nova conta a receber
const insertContaReceber = async (req, res) => {
  try {
    const { clienteid, valor, datavencimento } = req.body;
    if (!clienteid || !valor || !datavencimento) {
      return res.status(400).json({ status: 'error', message: 'Campos obrigatórios ausentes (clienteid, valor, datavencimento).' });
    }

    const novoRegistro = await mdlContasReceber.insertContaReceber(req.body);
    res.status(201).json({ status: 'ok', registro: novoRegistro });
  } catch (error) {
    console.error('Erro ao inserir conta a receber:', error);
    res.status(500).json({ status: 'error', message: 'Erro interno ao inserir conta a receber.' });
  }
};

// Atualizacao de registro existente
const updateContaReceber = async (req, res) => {
  try {
    const id = extrairId(req);
    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'ID inválido ou não informado.' });

    const { clienteid, valor, datavencimento } = req.body;
    if (!clienteid || !valor || !datavencimento) {
      return res.status(400).json({ status: 'error', message: 'Campos obrigatórios ausentes (clienteid, valor, datavencimento).' });
    }

    const registroAtualizado = await mdlContasReceber.updateContaReceber(id, req.body);
    if (!registroAtualizado) {
      return res.status(404).json({ status: 'error', message: 'Conta a receber não encontrada para atualização.' });
    }
    res.json({ status: 'ok', registro: registroAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar conta a receber:', error);
    res.status(500).json({ status: 'error', message: 'Erro interno ao atualizar conta a receber.' });
  }
};

// Exclusao logica da conta
const deleteContaReceber = async (req, res) => {
  try {
    const id = extrairId(req);
    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'ID inválido ou não informado.' });

    const registroRemovido = await mdlContasReceber.deleteContaReceber(id);
    if (!registroRemovido) {
      return res.status(404).json({ status: 'error', message: 'Conta não encontrada para remoção.' });
    }
    res.json({ status: 'ok', message: 'Conta a receber removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover conta a receber:', error);
    res.status(500).json({ status: 'error', message: 'Erro interno ao remover conta a receber.' });
  }
};

module.exports = {
  getAllContasReceber,
  getContaReceberByID,
  insertContaReceber,
  updateContaReceber,
  deleteContaReceber
};