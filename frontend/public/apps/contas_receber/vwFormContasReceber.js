document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const oper = urlParams.get('oper') || 'Cr';
  const id = urlParams.get('id');

  const form = document.getElementById('formContaReceber');
  const tituloForm = document.getElementById('tituloForm');
  const btnSalvar = document.getElementById('btnSalvar');
  const alertBox = document.getElementById('formAlert');

  // Base URL da API
  const servidor = (form && form.dataset.servidorDw3) ? form.dataset.servidorDw3 : 'http://localhost:40000';
  const selectCliente = document.getElementById('clienteid');

  // Monta cabecalho de requisicao com Bearer Token
  function obterHeaders() {
    let headers = { 'Content-Type': 'application/json' };
    const token = document.getElementById('token')?.value || localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  function exibirErro(msg) {
    if (alertBox) {
      alertBox.textContent = msg;
      alertBox.classList.remove('d-none');
    } else {
      alert(msg);
    }
  }

  // Carrega clientes ativos para o select
  try {
    const responseClientes = await fetch(`${servidor}/GetAllClientes`, {
      method: 'GET',
      headers: obterHeaders()
    });

    const resClientes = await responseClientes.json();
    
    if (resClientes.auth === false) {
      exibirErro('Sessão inválida ou expirada: ' + resClientes.message);
      return;
    }

    let listaClientes = Array.isArray(resClientes) ? resClientes : (resClientes.registros || resClientes.registro || []);

    if (listaClientes.length > 0 && selectCliente) {
      selectCliente.innerHTML = '<option value="">Selecione um cliente...</option>';
      listaClientes.filter(c => c.ativo && !c.removido && !c.deleted).forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.clienteid || cliente.id;
        option.textContent = `${cliente.codigo ? cliente.codigo + ' - ' : ''}${cliente.nome}`;
        selectCliente.appendChild(option);
      });

      // Inicializa componente Select2
      if (window.jQuery && $.fn.select2) {
        $(selectCliente).select2({
          theme: 'bootstrap-5',
          placeholder: 'Pesquise e selecione um cliente...',
          width: '100%'
        });
      }
    }
  } catch (error) {
    exibirErro('Erro ao carregar lista de clientes.');
  }

  // Ajusta titulos e estado dos campos conforme a operacao
  if (oper === 'Cr') {
    if (tituloForm) tituloForm.textContent = 'Incluir Nova Conta a Receber';
  } else {
    if (oper === 'Up') tituloForm.textContent = 'Atualizar Conta a Receber';
    else if (oper === 'Re') { 
      tituloForm.textContent = 'Consultar Conta a Receber'; 
      bloquearFormulario(); 
    } else if (oper === 'De') { 
      tituloForm.textContent = 'Remover Conta a Receber'; 
      bloquearFormulario(); 
      btnSalvar.textContent = 'Confirmar Exclusão'; 
      btnSalvar.classList.replace('btn-success', 'btn-danger'); 
    }
    await carregarDadosConta(id);
  }

  // Preenche dados da conta para edicao ou consulta
  async function carregarDadosConta(contaId) {
    if (!contaId) return;
    try {
      const response = await fetch(`${servidor}/getContaReceberByID/${contaId}`, { headers: obterHeaders() });
      const resultado = await response.json();
      if (resultado.status === 'ok' && resultado.registro) {
        const conta = resultado.registro;
        document.getElementById('contareceberid').value = conta.contareceberid;
        document.getElementById('descricao').value = conta.descricao;
        document.getElementById('valor').value = conta.valor;
        document.getElementById('recebido').checked = !!conta.recebido;
        if (conta.datavencimento) document.getElementById('datavencimento').value = conta.datavencimento.split('T')[0];
        
        if (selectCliente) {
          selectCliente.value = conta.clienteid;
          if (window.jQuery && $.fn.select2) $(selectCliente).trigger('change');
        }
      }
    } catch (error) {
      exibirErro('Erro ao carregar dados da conta.');
    }
  }

  // Desabilita inputs para operacoes de leitura e exclusao
  function bloquearFormulario() {
    Array.from(form.elements).forEach(el => el.disabled = true);
    if (btnSalvar) btnSalvar.disabled = false;
  }

  // Envio do formulario para a API
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { 
      form.classList.add('was-validated'); 
      return; 
    }

    let url = `${servidor}/insertContaReceber`;
    let method = 'POST';

    if (oper === 'Up') { 
      url = `${servidor}/updateContaReceber/${id}`; 
      method = 'PUT'; 
    } else if (oper === 'De') { 
      url = `${servidor}/deleteContaReceber/${id}`; 
      method = 'DELETE'; 
    }

    const payload = {
      clienteid: selectCliente.value,
      descricao: document.getElementById('descricao').value,
      valor: document.getElementById('valor').value,
      datavencimento: document.getElementById('datavencimento').value,
      recebido: document.getElementById('recebido').checked
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: obterHeaders(),
        body: method !== 'DELETE' ? JSON.stringify(payload) : undefined
      });

      const resultado = await response.json();
      if (resultado.status === 'ok' || response.ok) {
        window.location.href = '/contas_receber';
      } else {
        exibirErro(resultado.message || resultado.status || 'Erro ao salvar.');
      }
    } catch (error) {
      exibirErro('Erro de comunicação com o servidor Back-End.');
    }
  });
});