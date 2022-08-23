const router = require('express').Router();

router.all('/*', (req, res) => {
  res.status(404).send({ message: 'Такого адреса нет' });
});

module.exports = router;
