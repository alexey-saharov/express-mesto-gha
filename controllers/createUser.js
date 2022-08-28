const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CODE } = require('../utils/constants');

const createUser = (req, res) => {
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
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error.message}` });
        } else {
          res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
        }
      }));
};

module.exports = { createUser };
