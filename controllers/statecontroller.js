const router = require('express').Router();
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
State.belongsTo(User);


// Create state
router.post('/', (req, res) => {

  State.create({
    state: req.body.state.state,
    dateLastVisited: req.body.state.dateLastVisited,
    comments: req.body.state.comments,
    userId: req.body.state.userId, //req.params??

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

// Get all states
router.get('/', (req, res) => {
  State.findAll()
    .then(states => res.status(200).json(states))
    .catch(err => res.status(500).json({ error: err }))
});

// Get single states by id for updating
router.get('/id/:id', (req, res) => {
  State.findOne({where: {id: req.params.id}})
  .then(state => res.status(200).json(state))
  .catch(err => res.status(500).json(err))
});

// TODO search to validate is userid-state combination exists
router.get('/validate/:state/:userId', function(req, res) {
  State.findAll({where: {state: req.params.state, userId: req.params.userId}})
  .then(state => res.status(200).json(state))
  .catch(err => res.status(500).json(err))
});

// Get unique states for dropdowns
router.get('/unique', (req, res) => {
  State.find({attributes: ['state']})
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