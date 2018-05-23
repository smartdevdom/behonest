const router = require('express').Router();
const validate = require('express-validation');
const passport = require('passport');

// message validations
const { messageValidation } = require('./message.validations');

// message model
const Message = require('./message.model');

/**
 * @route  GET /api/v1/messages
 * @desc   Get messages by user id
 * @access Private
 */
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    const messages = await Message.find({ user: req.user._id });
    res.json(messages);
  }
);

/**
 * @route  POST /api/v1/messages
 * @desc   Create new message
 * @access Private
 */
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  validate(messageValidation),
  async (req, res) => {
    try {
      await Message.create(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

/**
 * @route  PUT /api/v1/messages
 * @desc   Update message
 * @access Private
 */
router.put(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    let message = await Message.findById(req.params.id);
    if (message) {
      try {
        let message = await Message.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.json(message);
      } catch (error) {
        res.status(400).json(error);
      }
    }
  }
);

/**
 * @route  DELETE /api/v1/messages
 * @desc   delete message
 * @access Private
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res) => {
    await Message.findByIdAndRemove(req.params.id);
    res.json({ success: true });
  }
);

module.exports = router;
