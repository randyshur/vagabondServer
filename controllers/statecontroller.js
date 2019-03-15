const router = require('express').Router();
const State = require('../db').import('../models/state');

// Create state for curren tuser
router.post('/',  (req, res) => {

  State.create({
    state: req.body.state,
    dateLastVisited: req.body.dateLastVisited,
    comments: req.body.comments,
    userId: req.body.id
  })
    .then(
      createSuccess = (state) => {

        res.json({
          state: state,
          message: 'state created'
        })
      },
      createError = err => res.status(500).send(err)
    )

})

module.exports = router;