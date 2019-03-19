const router = require('express').Router();
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
const validateSession = require('../middleware/validate-session')
const validateAdmin = require('../middleware/validate-admin')
const Sequelize = require('sequelize');

//Public Endpoints

// All states with users
router.get('/', (req, res) => {
  State.findAll({
    include: [
      {
        model: User
      }
    ]
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});

// All unique states
router.get('/unique', (req, res) => {
  State.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('state')), 'state']] })
    .then(states => res.status(200).json(states))
    .catch(err => res.status(500).json({ error: err }))
});

// Total state count
router.get('/statecount', (req, res) => {
  State.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'numStates']]
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});

// Total unique states
router.get('/uniquestatecount', (req, res) => {
  State.findAll({
    attributes: [[Sequelize.literal('COUNT(DISTINCT(state))'), 'numUniqueStates']]
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});

// Count by user
router.get('/countbyuser', (req, res) => {
 State.sequelize.query('select username, count(*) from users inner join states on states.user_id = users.id group by username'
)
    .then(user => res.status(200).json(user[0]))
    .catch(err => res.status(500).json(err))
});

// Count by state
router.get('/countbystate', (req, res) => {
  State.findAll({
    attributes: ['state', [Sequelize.fn('count', Sequelize.col('state')), 'stateCount']],
    group: ['state']
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});

// USER ENPOINTS - must have valid token to process their own data
// The following endpoints only allow owner to use
// Get states for current user
router.get('/mystates', validateSession, (req, res) => {
  if (!req.errors) {
    State.findAll({ where: { user_id: req.user.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Get state count for current user
router.get('/mystatecount', validateSession, (req, res) => {
  State.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'numStates']],
    where: { user_id: req.user.id }
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});

//// Search to validate is userid-state combination exists
router.get('/validate/:state', validateSession, function(req, res) {
  State.findAll({where: {state: req.params.state, user_id: req.user.id}})
  .then(state => res.status(200).json(state))
  .catch(err => res.status(500).json(err))
});

// Create state for current user
router.post('/mystate', validateSession, (req, res) => {

  if (!req.errors) {
    
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

  } else {
    res.status(500).json(req.errors)
  }

})

// Get state by id for updating for current user
router.get('/mystate/:id', validateSession, (req, res) => {
  if (!req.errors) {
    State.findOne({ where: { id: req.params.id, user_id: req.user.id} })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Update state for current user
router.put('/mystate/:id', validateSession, (req, res) => {
  if (!req.errors) {
    State.update(req.body, { where: { id: req.params.id, user_id: req.user.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Delete state for current user
// IMPORTANT! This is a cascaded delete all associated landmarks will be deleted
router.delete('/mystate/:id', validateSession, (req, res) => {
  if (!req.errors) {
    State.destroy({ where: { id: req.params.id, user_id: req.user.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// ADMIN ENDPOINTS - must have token with admin user id
// Get any state by id for updating
router.get('/admin/:id', validateAdmin, (req, res) => {
  if (!req.errors) {
    State.findOne({ where: { id: req.params.id } })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Update any state by id
router.put('/admin/:id', validateAdmin, (req, res) => {
  if (!req.errors) {
    State.update(req.body, { where: { id: req.params.id} })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

// Delete any state by id
// IMPORTANT! This is a cascaded delete all associated landmarks will be deleted
router.delete('/admin/:id', validateAdmin, (req, res) => {
  if (!req.errors) {
    State.destroy({ where: { id: req.params.id} })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(500).json(err))
  } else {
    res.status(500).json(req.errors)
  }
});

module.exports = router;