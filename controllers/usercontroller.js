const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {

    console.log('here is the req------>' + JSON.stringify(req.body))
    console.log('here is the req------>' + req.body.user.firstName)
/*
    User.create({
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      email: req.body.user.email,
      password: bcrypt.hashSync(req.body.user.password, 10)
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
      */
  })

  router.post('/signin', function (req, res) {
/*
    User.findOne({ where: { email: req.body.user.email } }
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
    */
  })

  module.exports = router;