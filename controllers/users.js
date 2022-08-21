const User = require('../models/user');

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

// Ответ с ошибкой должен быть единообразен, как и другие штуки в серверной разработке.
// Используйте такой формат ответа с ошибкой:
// {
//   "message": "Запрашиваемый пользователь не найден"
// }

const createUser = (req, res) => User.create(req.body)
  .then((user) => res.status(201).send({ user }))
  .catch((err) => res.status(500).send({ message: `Error creating user ${err}` }));

const getUser = (req, res) => {
  User.findById(req.body.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {});
}

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {});

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
};
