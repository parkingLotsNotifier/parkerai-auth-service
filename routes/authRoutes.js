const { Router } = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

// Protect routes
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!' });
});


module.exports = router;
