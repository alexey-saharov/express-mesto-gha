const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const incorrectRouter = require('./routes/incorrectRouter');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '6301bdd3dc69e6b85507245a',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', incorrectRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
