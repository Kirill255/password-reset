const User = require('../models/User');
const { promisify } = require("es6-promisify");

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register', csrfToken: req.csrfToken() });
};

exports.registerValidators = () => {
  return [
    body("name", "You must supply a name!").not().isEmpty({ ignore_whitespace: true }),
    body("email", "That Email is not valid!").isEmail().normalizeEmail({
      gmail_remove_dots: false, // don't use in production
      gmail_remove_subaddress: false // don't use in production
    }), // in production use — body("email", "That Email is not valid!").isEmail().normalizeEmail()
    body("password", "Password Cannot be Blank!").not().isEmpty({ ignore_whitespace: true }),
    body("password-confirm", "Confirmed Password cannot be blank!").not().isEmpty({ ignore_whitespace: true }),
    body("password-confirm", "Oops! Your passwords do not match!").custom((value, { req }) => value === req.body.password),
    sanitizeBody("*").trim().escape()
  ]
};

exports.validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg));
    res.render("register", { title: "Register", body: req.body, flashes: req.flash() });
    return;
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  // User.register(user, req.body.password, (err, user) => {}); // default method with callback
  const register = promisify(User.register.bind(User)); // but we want to use promise
  await register(user, req.body.password);
  next(); // pass to authController.login
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit Your Account', csrfToken: req.csrfToken() });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id }, // query
    { $set: updates }, // update data
    { new: true, runValidators: true, context: 'query' } // options
  );
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};
