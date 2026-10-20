// Ficheiro: frontend/public/js/dw3frontend.js

function dw3IsLogged() {
  return true;
}

function dw3MontarHeadersAutenticacao() {
  // Procura o token injetado na página ou no localStorage
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

function dw3Logout() {
  localStorage.removeItem('accessToken');
  window.location.href = '/Login';
}