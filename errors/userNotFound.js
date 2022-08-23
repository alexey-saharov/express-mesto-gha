const { ApplicationError } = require('./applicationError');
const { CODE } = require('../utils/constants');

class UserNotFound extends ApplicationError {
  constructor() {
    super(CODE.NOT_FOUND, 'User not found');
  }
}

module.exports = { UserNotFound };
