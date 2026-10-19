const axios = require('axios');

// Renderiza a página visual de Login
const Login = async (req, res) => {
    res.render('login', { message: null });
};

// Recebe os dados do formulário e envia para o Back-End
const RealizaLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Faz o POST para a API do Back-End na porta 40000
        const response = await axios.post(`${process.env.SERVIDOR_DW3}/Login`, {
            username,
            password
        });

        // Se a API devolver auth: true, guarda o token na sessão e vai para a Home
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

// Apaga a sessão e volta para o Login
const Logout = (req, res) => {
    req.session.destroy();
    res.redirect('/Login');
};

module.exports = {
    Login,
    RealizaLogin,
    Logout
};