const { ApplicationError } = require('./applicationError');

class UrlNotFound extends ApplicationError {
  constructor() {
    super(404, 'Url not found');
  }
}

module.exports = { UrlNotFound };
