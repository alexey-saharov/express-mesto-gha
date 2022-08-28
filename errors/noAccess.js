const { ApplicationError } = require('./applicationError');
const { CODE } = require('../utils/constants');

class NoAccess extends ApplicationError {
  constructor() {
    super(CODE.AUTHORIZED_NO_ACCESS, 'No access');
  }
}

module.exports = { NoAccess };
