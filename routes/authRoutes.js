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

// Camera routes
router.post('/register-camera', passport.authenticate('jwt', { session: false }), authController.register_camera);
router.delete('/remove-camera', passport.authenticate('jwt', { session: false }), authController.remove_camera);
router.post('/check-camera', passport.authenticate('jwt', { session: false }), authController.check_camera);

module.exports = router;
