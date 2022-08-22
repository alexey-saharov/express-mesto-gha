const { ApplicationError } = require('./applicationError');

class CardNotFound extends ApplicationError {
  constructor() {
    super(404, 'Card not found');
  }
}

module.exports = { CardNotFound };