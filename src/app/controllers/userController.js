// const { password } = require('../../config/database');
const Yup = require('yup');
const User = require('../models/User');

module.exports = {
  async register(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'failure to validate' });
    }
    const { name, email } = req.body;
    try {
      if (await User.findOne({ where: { email } }))
        return res.status(400).send({ error: 'email already exists' });

      const user = await User.create(req.body);

      user.password_hash = undefined;

      return res.json({
        name,
        email,
      });
    } catch (error) {
      return res.status(400).send({ error: 'failure to register' });
    }
  },

  async list(req, res) {
    const users = await User.findAll();
    return res.json(users);
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field,
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'failure to validate' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    try {
      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).send({ error: 'email already exists' });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).send({ erro: 'Invalid password' });
      }

      const { id, name, provider } = await user.update(req.body);

      return res.json({
        id,
        name,
        email,
        provider,
      });
    } catch (error) {
      return res.status(400).send({ error: 'failure to register' });
    }
  },
};
