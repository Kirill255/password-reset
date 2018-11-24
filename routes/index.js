var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');
const { registerAccountLimiter, resetPasswordLimiter, updateAccountLimiter } = require('../handlers/rateLimit');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// router.get('/', catchErrors(storeController.getStores));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
  registerAccountLimiter,
  userController.registerValidators(), // return array with validators
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account',
  updateAccountLimiter,
  catchErrors(userController.updateAccount)
);

router.post('/account/forgot',
  resetPasswordLimiter,
  catchErrors(authController.forgot)
); // send refresh token to email
router.get('/account/reset/:token', catchErrors(authController.reset)); // come to this page from email
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
); // update password

module.exports = router;
