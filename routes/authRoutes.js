const { Router } = require('express');
const loginController = require('../controllers/loginController');
const refreshController = require('../controllers/refreshController');
const registrationController = require('../controllers/registrationController');
const logoutController = require('../controllers/logoutController');

const router = Router();

router.post('/signup', registrationController.registrationHandler);
router.post('/login', loginController.loginHandler);
router.get('/logout', logoutController.logoutHandler);
router.get('/refresh',refreshController.handleRefreshToken);

module.exports = router;
