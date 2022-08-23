const { ApplicationError } = require('./applicationError');
const { CODE } = require('../utils/constants');

class CardNotFound extends ApplicationError {
  constructor() {
    super(CODE.NOT_FOUND, 'Card not found');
  }
}

module.exports = { CardNotFound };
