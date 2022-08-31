const { UrlNotFound } = require('../errors/urlNotFound');

const getUrlError = (req, res, next) => {
  next(new UrlNotFound());
};

module.exports = getUrlError;
