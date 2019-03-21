const router = require('express').Router();
const Landmark = require('../db').import('../models/landmark');
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
//Landmark.sync({force:true})

State.belongsTo(User);
Landmark.belongsTo(State);

router.get('/', (req, res) => {
    Landmark.findAll({ 
      include: [
        {
          model: State,
          include: [
            {
              model: User
            }
          ]
        }
      ]
    })
      .then(landmarks => res.status(200).json(landmarks))
      .catch(err => res.status(500).json({ error: err }))
  });

  module.exports = router;