const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CODE, SECRET_KEY } = require('../utils/constants');

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(CODE.NOT_AUTHORIZED)
        .send({ message: err.message });
    });
};

module.exports = { login };
