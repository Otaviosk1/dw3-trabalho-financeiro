document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('clientesListagem');
  var alertBox = document.getElementById('clientesAlert');
  if (!listagem) {
    return;
  }

  var servidorDw3 = listagem.dataset.servidorDw3;
  configurarOperacoesClientes(alertBox);
  carregarClientes(servidorDw3, alertBox);
});

// Busca a lista de clientes da API
async function carregarClientes(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereço do servidor backend não configurado.');
    }
    var response = await fetch(servidorDw3 + '/getAllClientes', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Não foi possível carregar a lista de clientes.');
    }

    var data = await response.json();
    if (data.auth === false) {
      throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta inválida do servidor backend.');
    }

    inicializarTabelaClientes(data.registro);
  } catch (error) {
    exibirErro(alertBox, error.message || 'Erro ao carregar clientes.');
    inicializarTabelaClientes([]);
  }
}

// Inicializacao e configuracao do DataTable
function inicializarTabelaClientes(clientes) {
  new DataTable('#tblClientes', {
    data: clientes,
    columns: [
      { data: 'clienteid', defaultContent: '' },
      { data: 'codigo', defaultContent: '' },
      { data: 'nome', defaultContent: '' },
      { data: 'endereco', defaultContent: '' },
      { 
        data: 'ativo', 
        defaultContent: '',
        render: function(data) {
          return data ? '<span class="badge bg-success">Sim</span>' : '<span class="badge bg-secondary">Não</span>';
        }
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }
          var clienteId = escaparHtml(row.clienteid || '');
          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operações do cliente">',
            '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-clienteid="' + clienteId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
            '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-clienteid="' + clienteId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
            '<button class="btn btn-outline-danger" type="button" data-action="remover" data-clienteid="' + clienteId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum cliente cadastrado.',
      info: 'Mostrando _START_ até _END_ de _TOTAL_ registos',
      infoEmpty: 'Mostrando 0 até 0 de 0 registos',
      infoFiltered: '(filtrado de _MAX_ registos no total)',
      lengthMenu: 'Mostrar _MENU_ registos',
      loadingRecords: 'A carregar...',
      processing: 'A processar...',
      search: 'Pesquisar:',
      zeroRecords: 'Nenhum registo encontrado',
      paginate: {
        first: 'Primeiro',
        last: 'Último',
        next: 'Seguinte',
        previous: 'Anterior'
      }
    }
  });
}

// Event delegation para os botoes de acao da tabela
function configurarOperacoesClientes(alertBox) {
  var tabela = document.getElementById('tblClientes');
  if (!tabela) {
    return;
  }
  tabela.addEventListener('click', function(event) {
    var botao = event.target.closest('button[data-action][data-clienteid]');
    if (!botao) {
      return;
    }
    var action = botao.dataset.action;
    var clienteId = botao.dataset.clienteid;

    if (action === 'visualizar') {
      window.location.href = '/clientes/form?oper=Re&clienteId=' + encodeURIComponent(clienteId);
      return;
    }
    if (action === 'atualizar') {
      window.location.href = '/clientes/form?oper=Up&clienteId=' + encodeURIComponent(clienteId);
      return;
    }
    if (action === 'remover') {
      window.location.href = '/clientes/form?oper=De&clienteId=' + encodeURIComponent(clienteId);
    }
  });
}

// Sanitizacao de strings para atributos HTML
function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Exibe mensagem de erro no container de alerta
function exibirErro(alertBox, mensagem) {
  if (!alertBox) {
    return;
  }
  alertBox.textContent = mensagem;
  alertBox.classList.remove('d-none');
}