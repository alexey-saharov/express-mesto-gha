const Card = require('../models/card');

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

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => res.status(500).send({ message: `Error creating user ${error}` }));
};

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(200).send(cards))
  .catch((error) => {});

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then(() => res.status(200).send({ message: 'Пост удалён' }))
  .catch((error) => res.status(500).send({ message: 'Произошла ошибка' }));

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch((error) => res.status(500).send({ message: 'Произошла ошибка' }));

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch((error) => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
