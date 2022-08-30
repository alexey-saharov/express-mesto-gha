const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CODE } = require('../utils/constants');
const { UserAlreadyExist } = require('../errors/userAlreadyExist');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((checkUser) => {
      if (checkUser) {
        throw new UserAlreadyExist();
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          })
            .then((user) => {
              const resUser = { ...user._doc };
              delete resUser.password;
              res.status(CODE.SUCCESS_CREATED).send({ resUser });
            })
            .catch(next));
      }
    })
    .catch(next);
};

module.exports = { createUser };
