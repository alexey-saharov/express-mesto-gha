const { UrlNotFound } = require('../errors/urlNotFound');

const getUrlError = (req, res) => {
  const error = new UrlNotFound();
  return res.status(error.status).send(error);
};

module.exports = getUrlError;
