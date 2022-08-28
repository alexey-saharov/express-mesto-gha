const Card = require('../models/card');
const { CardNotFound } = require('../errors/cardNotFound');
const { NoAccess } = require('../errors/noAccess');
const { CODE } = require('../utils/constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CODE.SUCCESS_CREATED).send(card))
    .catch(next);
};

const getCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.send(cards))
  .catch(next);

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner'])
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => {
      if (card.owner.id !== req.user._id) {
        throw new NoAccess();
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch(next);

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
