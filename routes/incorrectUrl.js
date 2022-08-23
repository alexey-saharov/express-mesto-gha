const router = require('express').Router();
const getUrlError = require('../controllers/incorrectUrl');

router.all('/*', getUrlError);

module.exports = router;
