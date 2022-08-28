const { UrlNotFound } = require('../errors/urlNotFound');

const getUrlError = (req, res, next) => {
  throw new UrlNotFound();
};

module.exports = getUrlError;
