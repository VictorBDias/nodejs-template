const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ erro: 'Autenticação necesária' });

  const parts = authHeader.split(' ');

  if (!parts.lenght === 2)
    return res.status(401).send({ erro: 'Erro de token (divisao)' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ erro: 'Erro de token (Bearer)' });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err)
      return res.status(401).send({ erro: 'Erro de token (Token inválido)' });

    req.userId = decoded.id;
    return next();
  });
  return this;
};
