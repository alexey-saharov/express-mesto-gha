const { ApplicationError } = require('./applicationError');

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'User not found');
  }
}

module.exports = { UserNotFound };
