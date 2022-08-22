const User = require('../models/user');
const { UserNotFound } = require('../errors/userNotFound');

// 200 - success
// 201 - success, resource created
// 400 - not valid data
// 401 - not authorized
// 403 - authorized, no access
// 404 - not found
// 422 - unprocessable entity
// 500 - server error

// Перед отправкой ошибки не забудьте проверить ее, например так:
//   const ERROR_CODE = 400;
// if (err.name === 'SomeErrorName') return res.status(ERROR_CODE).send(...)

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
    if (error.name === 'UserNotFound') {
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
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.userId, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
