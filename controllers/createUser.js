const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CODE } = require('../utils/constants');
const { UserAlreadyExist } = require('../errors/userAlreadyExist');

const createUser = (req, res, next) => {
  const reqUser = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne({ email: reqUser.email })
    .then((checkUser) => {
      if (checkUser) {
        throw new UserAlreadyExist();
      } else {
        bcrypt.hash(reqUser.password, 10)
          .then((hash) => User.create({ ...reqUser, password: hash })
            .then((user) => {
              const {
                name,
                about,
                avatar,
                email,
              } = user;
              res.status(CODE.SUCCESS_CREATED).send({
                name,
                about,
                avatar,
                email,
              });
            })
            .catch(next));
      }
    })
    .catch(next);
};

module.exports = { createUser };
