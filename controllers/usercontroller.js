const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Sign up a new user
router.post('/signup', (req, res) => {

  User.create({
    username: req.body.user.username,
    password: bcrypt.hashSync(req.body.user.password, 10),
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    address: req.body.user.address,
    city: req.body.user.city,
    state: req.body.user.state,
    zip: req.body.user.zip,
    latitude: req.body.user.latitude,
    longitude: req.body.user.longitude
  })
    .then(
      createSuccess = (user) => {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

        res.json({
          user: user,
          message: 'user created',
          sessionToken: token
        })
      },
      createError = err => res.status(500).send(err)
    )

})

// Sign in user
router.post('/signin', function (req, res) {

  User.findOne({ where: { username: req.body.user.username } }
  ).then(
    function (user) {
      if (user) {

        bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
          if (matches) {
            var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
            res.json({ user: user, message: 'successfully authenticated', sessionToken: token });
          } else {
            res.status(502).send({ error: "you failed a" });
          }
        })
      } else {
        res.status(500).send({ error: "failed to authenticate" });
      }
    },
    function (err) {
      res.status(501).send({ error: "you failed b" });
    }
  )

})

// Get all users
router.get('/', (req, res) => {
  User.findAll()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err }))
});

// Update Users
router.put('/:id', (req, res) => {
  if (!req.errors) {
    User.update(req.body.user, { where: { id: req.params.id }})
      .then(user => res.status(200).json(user))
      .catch(err => res.json(err))
  } else {
    res.status(500).json(req.errors)
  }
})

// Delete user
router.delete('/:id', (req, res) => {
  if (!req.errors) {
    User.destroy({ where: { id: req.params.id }})
      .then(user => res.status(200).json(user))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

module.exports = router;