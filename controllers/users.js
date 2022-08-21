const User = require('../models/user');

const createUser = (req, res) => User.create(req.body)
  .then((user) => res.status(201).send({ user }))
  .catch((e) => res.status(500).send({ message: `Error creating user ${e}` }));

const getUser = (req, res) => User.findById(req.params.id)
  .onFail(() => {
    throw new Error('User not found');
  })
  .then((user) => res.status(200).send(user))
  .catch((e) => {});

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((e) => {});

module.exports = { createUser, getUsers, getUser };
