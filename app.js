const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/createUser');
const { auth } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const incorrectRouter = require('./routes/incorrectUrl');
const { CODE, AVATAR_LINK_REGEXP } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(`${AVATAR_LINK_REGEXP}`)),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/', incorrectRouter);

app.use(errors());

app.use((err, req, res, next) => {
  if (
    err.name === 'NotAuthorized'
    || err.name === 'UserNotFound'
    || err.name === 'CardNotFound'
    || err.name === 'NoAccess'
    || err.name === 'UrlNotFound'
  ) {
    res.status(err.status).send({ message: `${err.message}` });
  } else if (err.code === 11000) {
    res.status(CODE.CONFLICT).send({ message: `${err.message}` });
  } else if (err.name === 'CastError') {
    res.status(CODE.NOT_VALID_DATA).send({ message: `CastError - ${err.message}` });
  } else if (err.name === 'ValidationError') {
    res.status(CODE.NOT_VALID_DATA).send({ message: `Validation error - ${err.message}` });
  } else {
    res.status(CODE.SERVER_ERROR).send({ message: `Internal server error - ${err.message}` });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
