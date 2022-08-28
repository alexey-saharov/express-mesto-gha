const { ApplicationError } = require('./applicationError');
const { CODE } = require('../utils/constants');

class NotAuthorized extends ApplicationError {
  constructor() {
    super(CODE.NOT_AUTHORIZED, 'User not authorized');
  }
}

module.exports = { NotAuthorized };
