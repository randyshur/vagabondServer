const router = require('express').Router();
const State = require('../db').import('../models/state');
const Landmark = require('../db').import('../models/landmark');
Landmark.belongsTo(State);

router.post('/create', (req, res) => {

    console.log('landmark create');

  })

  module.exports = router;