const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CODE } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(CODE.SUCCESS_CREATED).send({ user }))
      .catch(next));
};

module.exports = { createUser };
