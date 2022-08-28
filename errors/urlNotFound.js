const { ApplicationError } = require('./applicationError');
const { CODE } = require('../utils/constants');

class UrlNotFound extends ApplicationError {
  constructor() {
    super(CODE.NOT_FOUND, 'Url not found');
  }
}

module.exports = { UrlNotFound };
