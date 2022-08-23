const User = require('../models/user');
const { UserNotFound } = require('../errors/userNotFound');

const createUser = (req, res) => User.create(req.body)
  .then((user) => res.status(201).send({ user }))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: `Error validation error ${error}` });
    } else {
      res.status(500).send({ message: `Internal server error ${error}` });
    }
  });

const getUser = (req, res) => User.findById(req.params.userId)
  .orFail(() => {
    throw new UserNotFound();
  })
  .then((user) => res.status(200).send(user))
  .catch((error) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      res.status(400).send({ message: `Error validation error ${error}` });
    } else if (error.name === 'UserNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
    } else {
      res.status(500).send({ message: `Internal server error ${error}` });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((error) => {
    res.status(500).send({ message: `Internal server error ${error}` });
  });

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Error validation error ${error}` });
      } else if (error.name === 'UserNotFound') {
        res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Error validation error ${error}` });
      } else if (error.name === 'UserNotFound') {
        res.status(error.status).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
