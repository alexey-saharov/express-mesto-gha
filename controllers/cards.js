const Card = require('../models/card');
const { CardNotFound } = require('../errors/cardNotFound');
const { CODE } = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CODE.SUCCESS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error.message}` });
      } else {
        res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
      }
    });
};

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.send(cards))
  .catch((error) => {
    res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
  });

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .populate(['owner'])
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => {
      if (card.owner.id !== req.user._id) {
        res.status(CODE.AUTHORIZED_NO_ACCESS).send({ message: 'Нет доступа на удаление чужого поста' });
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch((error) => {
          if (error.name === 'CastError') {
            res.status(CODE.NOT_VALID_DATA).send({ message: `Error ${error.message}` });
          } else if (error.name === 'CardNotFound') {
            res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
          } else {
            res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
          }
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(CODE.NOT_VALID_DATA).send({ message: `Error ${error.message}` });
      } else if (error.name === 'CardNotFound') {
        res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
      }
    });
};

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
    if (error.name === 'CastError') {
      res.status(CODE.NOT_VALID_DATA).send({ message: `Validation error ${error.message}` });
    } else if (error.name === 'CardNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
    } else {
      res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
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
    if (error.name === 'CastError') {
      res.status(CODE.NOT_VALID_DATA).send({ message: `Error validation error ${error.message}` });
    } else if (error.name === 'CardNotFound') {
      res.status(error.status).send({ message: 'Запрашиваемая карточка не найдена' });
    } else {
      res.status(CODE.SERVER_ERROR).send({ message: `Internal server error ${error.message}` });
    }
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
