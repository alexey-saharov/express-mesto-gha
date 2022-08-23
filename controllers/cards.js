const Card = require('../models/card');
const { CardNotFound } = require('../errors/cardNotFound');
const { CODE } = require('../utils/constants');

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(CODE.SUCCESS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error}` });
      } else {
        res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error}` });
      }
    });
};

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(CODE.SUCCESS).send(cards))
  .catch((error) => {
    res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error}` });
  });

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => {
    throw new CardNotFound();
  })
  .then(() => res.status(CODE.SUCCESS).send({ message: 'Пост удалён' }))
  .catch((error) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error}` });
    } else if (error.name === 'CardNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
    } else {
      res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error}` });
    }
  });

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error}` });
    } else if (error.name === 'CardNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
    } else {
      res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error}` });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error}` });
    } else if (error.name === 'CardNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
    } else {
      res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error}` });
    }
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
