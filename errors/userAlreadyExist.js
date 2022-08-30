const { ApplicationError } = require('./applicationError');
const { CODE } = require('../utils/constants');

class UserAlreadyExist extends ApplicationError {
  constructor() {
    super(CODE.CONFLICT, 'User already exist');
  }
}

module.exports = { UserAlreadyExist };
