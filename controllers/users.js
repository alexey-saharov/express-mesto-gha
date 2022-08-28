const User = require('../models/user');
const { UserNotFound } = require('../errors/userNotFound');
const { CODE } = require('../utils/constants');

const getUser = (req, res) => User.findById(req.params.userId)
  .orFail(() => {
    throw new UserNotFound();
  })
  .then((user) => res.send(user))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error.message}` });
    } else if (error.name === 'UserNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
    } else {
      res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users))
  .catch((error) => {
    res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
  });

const getUserMe = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(CODE.NOT_VALID_DATA).send({ message: `Validation error ${error.message}` });
      } else if (error.name === 'UserNotFound') {
        res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error.message}` });
      } else if (error.name === 'UserNotFound') {
        res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error.message}` });
      } else if (error.name === 'UserNotFound') {
        res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
};
