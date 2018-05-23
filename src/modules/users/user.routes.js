const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const _ = require('lodash');
const passport = require('passport');
const validate = require('express-validation');

// user validations
const {
  userRegisterValidation,
  userLoginValidation
} = require('./user.validations');

// user model
const User = require('./user.model');

/**
 * @route  POST /api/v1/users/register
 * @desc   Register user
 * @access Public
 */
router.post('/register', validate(userRegisterValidation), async (req, res) => {
  const { username, email } = req.body;
  let user = await User.findOne().or([{ username }, { email }]);
  if (user)
    return res.status(400).json({ error: 'Username or E-mail already taken' });

  user = new User(
    _.pick(req.body, [
      'fullname',
      'username',
      'password',
      'email',
      'birthdate',
      'gender',
      'country',
      'notifications'
    ])
  );

  const avatar = gravatar.url(user.email, {
    s: '200', // Size
    r: 'pg', // rating
    d: 'robohash',
    protocol: 'https'
  });
  user.avatar = avatar;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    return res.json(user.authJSON());
  } catch (error) {
    return res.status(400).json(error);
  }
});

/**
 * @route  POST /api/v1/users/login
 * @desc   Login user
 * @access Public
 */
router.post('/login', validate(userLoginValidation), async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (!user)
    return res.status(404).json({ error: 'Username or password is invalid' });

  let checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword)
    return res.status(404).json({ error: 'Username or password is invalid' });

  res.json(user.authJSON());
});

/**
 * @route   GET /api/v1/users/current
 * @desc    Return current user
 * @access  Private
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

/**
 * @route   DELETE /api/v1/users
 * @desc    Delete my account
 * @access  Private
 */
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await User.findByIdAndRemove(req.user._id);
    res.json({ success: true });
  }
);

module.exports = router;
