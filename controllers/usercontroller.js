const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session')
const validateAdmin = require('../middleware/validate-admin')
const Sequelize = require('sequelize');

// Sign up a new user
router.post('/signup', (req, res) => {

  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    latitude: req.body.latitude,
    longitude: req.body.longitude
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

  User.findOne({ where: { username: req.body.username } }
  ).then(
    function (user) {
      if (user) {

        bcrypt.compare(req.body.password, user.password, function (err, matches) {
          if (matches) {
            var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
            res.json({ user: user, message: 'successfully authenticated', sessionToken: token });
          } else {
            res.status(401).send({ error: "invalid password" });
          }
        })
      } else {
        res.status(401).send({ error: "failed to authenticate" });
      }
    },
    function (err) {
      res.status(500).send({ error: "signin error" });
    }
  )

})

// Get count of users in the system
router.get('/usercount', (req, res) => {
    User.findAll({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'numUsers']]
    })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
});

// USER ENPOINTS - must have valid token to process their own data
// The following endpoints only allow owner to use
router.get('/myuser', validateSession, (req, res) => {9
  if (!req.errors) {
    User.findOne({ where: { id: req.user.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Update users data
router.put('/myuser/', validateSession, (req, res) => {
  if (!req.errors) {
    User.update(req.body, { where: { id: req.user.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.json(err))
  } else {
    res.status(500).json(req.errors)
  }
})

// Delete users data
router.delete('/myuser', validateSession, (req, res) => {
  if (!req.errors) {
    User.destroy({ where: { id: req.user.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

// ADMIN ENDPOINTS - must have token with admin user id

// Get all users
router.get('/admin', validateAdmin, (req, res) => {
  if (!req.errors) {
    User.findAll({
      order: [
        ['username', 'ASC'],
    ],
    })
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).json({ error: err }))
  } else {
    res.status(500).json(req.errors)
  }
});

// Get single user by id for updating
router.get('/admin/:id', validateAdmin, (req, res) => {
  if (!req.errors) {
    User.findOne({ where: { id: req.params.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Update Users
router.put('/admin/:id', validateAdmin, (req, res) => {
  if (!req.errors) {
    User.update(req.body, { where: { id: req.params.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.json(err))
  } else {
    res.status(500).json(req.errors)
  }
})

// Delete user
router.delete('/admin/:id', validateAdmin, (req, res) => {
  if (!req.errors) {
    User.destroy({ where: { id: req.params.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

module.exports = router;