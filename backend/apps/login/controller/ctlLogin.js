const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const mdlLogin = require("../model/mdlLogin");

// Valida credenciais do usuario e emite o token JWT
const Login = async (req, res) => {
  const { username, password } = req.body;
  const credencial = await mdlLogin.GetCredencial(username);

  if (credencial.length === 0) {
    return res.status(200).json({ auth: false, message: "Usuário não identificado!" });
  }

  // Compara a senha informada com o hash salvo
  if (bCrypt.compareSync(password, credencial[0].password)) {
    const token = jwt.sign(
      { username: credencial[0].username }, 
      process.env.SECRET_API, 
      { expiresIn: '8h' }
    );
    return res.json({ auth: true, token });
  }

  return res.status(200).json({ auth: false, message: "Login inválido!" });
};

// Middleware de autorizacao por Bearer Token
function AutenticaJWT(req, res, next) {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader) {
    return res.status(200).json({ auth: false, message: "Não foi informado o token JWT" });
  }

  const bearer = tokenHeader.split(" ");
  const token = bearer[1];

  jwt.verify(token, process.env.SECRET_API, (err, decoded) => {
    if (err) {
      return res.status(200).json({ auth: false, message: "JWT inválido ou expirado" });
    }
    req.userId = decoded.id;
    next();
  });
}

// Invalida o token no cliente
const Logout = (req, res) => {
  res.json({ auth: false, token: null });
};

module.exports = {
  Login,
  Logout,
  AutenticaJWT,
};