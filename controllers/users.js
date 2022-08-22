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

class ApplicationError extends Error {
  constructor(status = 500, message = 'Internal Error') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'User not found');
  }
}

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
    console.log('1');
    throw new UserNotFound();
  })
  .then((user) => res.status(200).send(user))
  .catch((error) => {
    console.log(req.params.userId);
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
