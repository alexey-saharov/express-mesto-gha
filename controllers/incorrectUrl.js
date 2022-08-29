const { UrlNotFound } = require('../errors/urlNotFound');

const getUrlError = () => {
  throw new UrlNotFound();
};

module.exports = getUrlError;
