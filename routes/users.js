const router = require('express').Router();

const {
  getUsers,
  getUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getUserMe);
router.get('/:userId', getUser);
router.get('/', getUsers);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);

module.exports = router;
