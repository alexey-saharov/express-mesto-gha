const User = require('../models/user');
const { UserNotFound } = require('../errors/userNotFound');
const { ApplicationError } = require('../errors/applicationError');
const { CODE } = require('../utils/constants');

const getUser = (req, res, next) => User.findById(req.params.userId)
  .orFail(() => {
    throw new UserNotFound();
  })
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'UserNotFound') {
      next(err);
    } else {
      next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
    }
  });

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch((err) => {
    next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
  });

const getUserMe = (req, res, next) => User.findById(req.user._id)
  .orFail(() => {
    throw new UserNotFound();
  })
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'UserNotFound') {
      next(err);
    } else {
      next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
    }
  });

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        next(err);
      } else if (err.code === 11000) {
        next(new ApplicationError(CODE.CONFLICT, err.message));
      } else if (err.name === 'CastError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `CastError - ${err.message}`));
      } else if (err.name === 'ValidationError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `Validation error - ${err.message}`));
      } else {
        next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        next(err);
      } else if (err.code === 11000) {
        next(new ApplicationError(CODE.CONFLICT, err.message));
      } else if (err.name === 'CastError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `CastError - ${err.message}`));
      } else if (err.name === 'ValidationError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `Validation error - ${err.message}`));
      } else {
        next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
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
