const CODE = {
  SUCCESS: 200,
  SUCCESS_CREATED: 201,
  NOT_VALID_DATA: 400,
  NOT_AUTHORIZED: 401,
  AUTHORIZED_NO_ACCESS: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

const SECRET_KEY = 'My-top-secret-key';

const LINK_REGEXP = /https?:\/\/(w{3}\.)?([\w-]+\.)+\w+(\/[\w\-.~:?#[\]@!$&'()*+,;=]+)*\/?/;

module.exports = { CODE, SECRET_KEY, LINK_REGEXP };
