document.addEventListener('DOMContentLoaded', async () => {
  try {
    const servidor = typeof servidorDw3 !== 'undefined' ? servidorDw3 : 'http://localhost:40000';

    // Monta os headers com o token de autorizacao
    function obterHeaders() {
      let headers = { 'Content-Type': 'application/json' };
      if (typeof dw3MontarHeadersAutenticacao === 'function') {
        try {
          headers = Object.assign(headers, dw3MontarHeadersAutenticacao());
        } catch (e) {
          console.warn('Falha em dw3MontarHeadersAutenticacao:', e);
        }
      }
      const token = document.getElementById('token')?.value || localStorage.getItem('token');
      if (token && !headers['Authorization'] && !headers['authorization']) {
        headers['Authorization'] = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
      }
      return headers;
    }

    // Busca registros da API
    const response = await fetch(`${servidor}/getAllContasReceber`, {
      method: 'GET',
      headers: obterHeaders()
    });

    const resultado = await response.json();

    if (resultado.status === 'ok') {
      const tbody = document.querySelector('#tabelaContasReceber tbody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const contas = resultado.registros || resultado.registro || [];

      // Renderiza as linhas da tabela
      contas.forEach(conta => {
        const tr = document.createElement('tr');

        const dataFormatada = conta.datavencimento 
          ? new Date(conta.datavencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
          : '';
        const valorFormatado = Number(conta.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const statusBadge = conta.recebido 
          ? '<span class="badge bg-success">Recebido</span>' 
          : '<span class="badge bg-warning text-dark">Pendente</span>';

        tr.innerHTML = `
          <td>${conta.contareceberid}</td>
          <td>${conta.nome_cliente || ''}</td>
          <td>${conta.descricao || ''}</td>
          <td>${valorFormatado}</td>
          <td>${dataFormatada}</td>
          <td>${statusBadge}</td>
          <td>
            <a href="/contas_receber/form?oper=Re&id=${conta.contareceberid}" class="btn btn-sm btn-info text-white" title="Visualizar">Consultar</a>
            <a href="/contas_receber/form?oper=Up&id=${conta.contareceberid}" class="btn btn-sm btn-warning" title="Editar">Editar</a>
            <a href="/contas_receber/form?oper=De&id=${conta.contareceberid}" class="btn btn-sm btn-danger" title="Remover">Excluir</a>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Inicializa o DataTable
      if (window.jQuery && $.fn.DataTable) {
        if ($.fn.DataTable.isDataTable('#tabelaContasReceber')) {
          $('#tabelaContasReceber').DataTable().destroy();
        }
        $('#tabelaContasReceber').DataTable({
          language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
          }
        });
      }
    }
  } catch (error) {
    console.error('Erro ao carregar listagem de contas a receber:', error);
  }
});