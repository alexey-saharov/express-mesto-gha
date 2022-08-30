const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { AVATAR_LINK_REGEXP } = require('../utils/constants');

const {
  getUsers,
  getUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.get('/', getUsers);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(`${AVATAR_LINK_REGEXP}`)),
  }),
}), updateUserAvatar);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
