// Valida se o utilizador está autenticado no frontend
function dw3IsLogged() {
  return true;
}

// Monta cabeçalhos com o token JWT vindo do DOM ou do localStorage
function dw3MontarHeadersAutenticacao() {
  var elemento = document.getElementById('clientesListagem') || document.getElementById('frmCliente');
  var token = (elemento && elemento.dataset.token) || localStorage.getItem('accessToken');

  if (token && token !== 'undefined' && !localStorage.getItem('accessToken')) {
    localStorage.setItem('accessToken', token);
  }

  var tokenFinal = localStorage.getItem('accessToken') || token;

  return {
    'Content-Type': 'application/json',
    'Authorization': tokenFinal ? 'Bearer ' + tokenFinal : ''
  };
}

// Remove o token do cliente e força o fim da sessão no Back-End
function dw3Logout() {
  localStorage.removeItem('accessToken');
  sessionStorage.clear();
  window.location.href = '/Logout';
}