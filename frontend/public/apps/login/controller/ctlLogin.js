const axios = require('axios');

// Renderiza a view de login
const Login = async (req, res) => {
  res.render('login', { message: null });
};

// Autentica o usuario na API e inicializa a sessao
const RealizaLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post(`${process.env.SERVIDOR_DW3}/Login`, {
      username,
      password
    });

    if (response.data.auth) {
      req.session.token = response.data.token;
      res.redirect('/');
    } else {
      res.render('login', { message: 'Usuário ou senha incorretos!' });
    }
  } catch (error) {
    console.error(error);
    res.render('login', { message: 'Erro ao conectar com o Back-End. Verifique se a porta 40000 está rodando.' });
  }
};

// Encerra a sessao do usuario
const Logout = (req, res) => {
  req.session.destroy();
  res.redirect('/Login');
};

module.exports = {
  Login,
  RealizaLogin,
  Logout
};