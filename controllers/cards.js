const Card = require('../models/card');
const { CardNotFound } = require('../errors/cardNotFound');
const { NoAccess } = require('../errors/noAccess');
const { CODE } = require('../utils/constants');
const { ApplicationError } = require('../errors/applicationError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CODE.SUCCESS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `Validation error - ${err.message}`));
      } else {
        next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
      }
    });
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch((err) => {
    next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
  });

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner']) // card.owner.id is used below
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => {
      if (card.owner.id !== req.user._id) {
        throw new NoAccess();
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CardNotFound' || err.name === 'NoAccess') {
        next(err);
      } else if (err.name === 'CastError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `CastError - ${err.message}`));
      } else {
        next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      next(err);
    } else if (err.name === 'CastError') {
      next(new ApplicationError(CODE.NOT_VALID_DATA, `CastError - ${err.message}`));
    } else {
      next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
    }
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      next(err);
    } else if (err.name === 'CastError') {
      next(new ApplicationError(CODE.NOT_VALID_DATA, `CastError - ${err.message}`));
    } else {
      next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
    }
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
