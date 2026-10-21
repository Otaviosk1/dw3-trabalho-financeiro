document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmCliente');
  var alertBox = document.getElementById('formAlert');
  if (!form) {
    return;
  }

  var servidorDw3 = form.dataset.servidorDw3;
  var urlParams = new URLSearchParams(window.location.search);
  var oper = urlParams.get('oper') || 'Cr';
  var clienteId = urlParams.get('clienteId');

  ajustarInterfaceFormulario(oper);

  if (clienteId && (oper === 'Up' || oper === 'Re' || oper === 'De')) {
    carregarClientePorId(servidorDw3, clienteId, alertBox);
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    processarSubmissaoFormulario(servidorDw3, oper, clienteId, alertBox);
  });
});

// Ajusta titulos e botoes conforme a operacao (Cr, Up, Re, De)
function ajustarInterfaceFormulario(oper) {
  var title = document.getElementById('formTitle');
  var btnSalvar = document.getElementById('btnSalvar');

  if (oper === 'Cr') {
    title.textContent = 'Incluir Novo Cliente';
    btnSalvar.textContent = 'Inserir';
  } else if (oper === 'Up') {
    title.textContent = 'Atualizar Cliente';
    btnSalvar.textContent = 'Alterar';
  } else if (oper === 'Re') {
    title.textContent = 'Consultar Cliente';
    btnSalvar.classList.add('d-none');
    desativarCampos();
  } else if (oper === 'De') {
    title.textContent = 'Remover Cliente';
    btnSalvar.textContent = 'Confirmar Remoção';
    btnSalvar.classList.remove('btn-primary');
    btnSalvar.classList.add('btn-danger');
    desativarCampos();
  }
}

// Desabilita inputs para visualizacao ou exclusao
function desativarCampos() {
  var campos = ['codigo', 'nome', 'endereco', 'ativo'];
  campos.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.disabled = true;
    }
  });
}

// Carrega os dados do cliente por ID
async function carregarClientePorId(servidorDw3, clienteId, alertBox) {
  try {
    var response = await fetch(servidorDw3 + '/getClienteByID/' + clienteId, {
      headers: dw3MontarHeadersAutenticacao()
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do cliente.');
    }
    var data = await response.json();
    if (data.auth === false) {
      throw new Error(data.message || 'Sessão expirada.');
    }
    if (data.status !== 'ok' || !data.registro) {
      throw new Error('Cliente não encontrado.');
    }

    var reg = data.registro;
    document.getElementById('clienteid').value = reg.clienteid || '';
    document.getElementById('codigo').value = reg.codigo || '';
    document.getElementById('nome').value = reg.nome || '';
    document.getElementById('endereco').value = reg.endereco || '';
    document.getElementById('ativo').checked = !!reg.ativo;
  } catch (error) {
    exibirErro(alertBox, error.message);
  }
}

// Envia os dados para a API conforme o verbo HTTP correspondente
async function processarSubmissaoFormulario(servidorDw3, oper, clienteId, alertBox) {
  var urlServidor = servidorDw3 || 'http://localhost:40000';

  var dados = {
    codigo: document.getElementById('codigo').value,
    nome: document.getElementById('nome').value,
    endereco: document.getElementById('endereco').value,
    ativo: document.getElementById('ativo').checked
  };

  var url = urlServidor + '/insertCliente';
  var method = 'POST';

  if (oper === 'Up') {
    url = urlServidor + '/updateCliente/' + clienteId;
    method = 'PUT';
  } else if (oper === 'De') {
    url = urlServidor + '/deleteCliente/' + clienteId;
    method = 'DELETE';
    dados = {};
  }

  try {
    var headers = Object.assign(
      { 'Content-Type': 'application/json' },
      typeof dw3MontarHeadersAutenticacao === 'function' ? dw3MontarHeadersAutenticacao() : {}
    );

    var response = await fetch(url, {
      method: method,
      headers: headers,
      body: method !== 'DELETE' ? JSON.stringify(dados) : undefined
    });

    var data = await response.json();

    // Trata mensagens de erro retornadas pelo backend
    if (!response.ok || data.auth === false || data.status !== 'ok') {
      var mensagemReal = (data.status && data.status !== 'error' && data.status !== 'ok')
        ? data.status
        : (data.message || 'Erro ao executar operação no servidor.');

      throw new Error(mensagemReal);
    }

    window.location.href = '/clientes';
  } catch (error) {
    exibirErro(alertBox, error.message);
  }
}

function exibirErro(alertBox, mensagem) {
  if (!alertBox) {
    return;
  }
  alertBox.textContent = mensagem;
  alertBox.classList.remove('d-none');
}