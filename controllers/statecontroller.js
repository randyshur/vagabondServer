const router = require('express').Router();
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
State.belongsTo(User);

router.post('/create', (req, res) => {

    console.log('state create');

  })

  module.exports = router;