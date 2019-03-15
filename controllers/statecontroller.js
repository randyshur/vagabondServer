const router = require('express').Router();
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
const validateSession = require('../middleware/validate-session')
var sequelize = require('sequelize')
State.belongsTo(User);

// Create state for curren tuser
router.post('/mine', validateSession, (req, res) => {

  State.create({
    state: req.body.state,
    dateLastVisited: req.body.dateLastVisited,
    comments: req.body.comments,
    userId: req.user.id
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

// Get all states for current user
router.get('/mine', validateSession, (req, res) => {
  State.findOne({where: {id: req.user.id}})
  .then(state => res.status(200).json(state))
  .catch(err => res.status(500).json(err))
});

// Get all states
router.get('/', (req, res) => {
  State.findAll()
    .then(states => res.status(200).json(states))
    .catch(err => res.status(500).json({ error: err }))
});

// Search to validate is userid-state combination exists
router.get('/validate/:state/:userId', function(req, res) {
  State.findAll({where: {state: req.params.state, userId: req.params.userId}})
  .then(state => res.status(200).json(state))
  .catch(err => res.status(500).json(err))
});

// Get unique states for dropdowns
router.get('/unique', (req, res) => {
  State.findAll({ attributes: [[sequelize.fn('DISTINCT', sequelize.col('state')), 'state']] })
    .then(states => res.status(200).json(states))
    .catch(err => res.status(500).json({ error: err }))
});

// Update states
router.put('/:id', (req, res) => {
  if (!req.errors) {
    State.update(req.body.state, { where: { id: req.params.id }})
      .then(state => res.status(200).json(state))
      .catch(err => res.json(err))
  } else {
    res.status(500).json(req.errors)
  }
})

// Delete state
router.delete('/:id', (req, res) => {
  if (!req.errors) {
    State.destroy({ where: { id: req.params.id }})
      .then(state => res.status(200).json(state))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

module.exports = router;