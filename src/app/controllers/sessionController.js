const jwt = require('jsonwebtoken');
const Yup = require('yup');
const User = require('../models/User');

const authConfig = require('../../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, { expiresIn: 31104000 });
}

module.exports = {
  async authenticate(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'failure to validate' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ erro: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).send({ erro: 'Invalid password' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: generateToken({ id: user.id }),
    });
  },
};
