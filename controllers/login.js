const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_KEY } = require('../utils/constants');
const { NotAuthorized } = require('../errors/notAuthorized');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      const error = new NotAuthorized();
      next(error);
    });
};

module.exports = { login };
