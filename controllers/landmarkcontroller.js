const router = require('express').Router();
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
const Landmark = require('../db').import('../models/landmark');
const validateSession = require('../middleware/validate-session')
const validateAdmin = require('../middleware/validate-admin')
const Sequelize = require('sequelize');

//Public Endpoints

// All landmarks with states and users
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
    ],
  })
    .then(landmarks => res.status(200).json(landmarks))
    .catch(err => res.status(500).json({ error: err }))
});

// Sorted landmarks with states and users
// Note only sorts on landmark fields for now
router.get('/sort/:field/:direction', (req, res) => {
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
    ],
    order: [
      [req.params.field, req.params.direction],
    ]
  })
    .then(landmarks => res.status(200).json(landmarks))
    .catch(err => res.status(500).json({ error: err }))
});

// Count of landmarks
router.get('/landmarkcount', (req, res) => {
  Landmark.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'numLandmarks']]
  })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});

// Count of landmarks by state
router.get('/countbystate', (req, res) => {
    Landmark.sequelize.query('select state, count(*) from states inner join landmarks on landmarks.state_id = states.id group by state')
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
});
router.get('/countbyuser', (req, res) => {
  State.sequelize.query('select username, count(*) from users inner join states on states.user_id = users.id group by username'
 )
     .then(user => res.status(200).json(user[0]))
     .catch(err => res.status(500).json(err))
 });


// USER ENPOINTS - must have valid token to process their own data
// The following endpoints only allow owner to use
// Create Landmark for current user
// Note: Form only passes 2 character state code need to get corresponding
// state_id or create new state for user
router.post('/', validateSession, (req, res) => {

  // Need to get state_id if it exists if not create state as well
  // and use state_id from newly created state
  State.findOne({where: {state: req.body.state, user_id: req.user.id}})
  .then(state => {

    if (state === null) {

      // Oops no state need to create it first
      State.create({
        state: req.body.state,
        dateLastVisited: req.body.dateLastVisited,
        userId: req.user.id
      })
        .then(
          createSuccess = (state) => {

            // Now we can create the landmark
            Landmark.create({
              title: req.body.title,
              address: req.body.address,
              city: req.body.city,
              zip: req.body.zip,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              dateLastVisited: req.body.dateLastVisited,
              imageURL: req.body.imageURL,
              comments: req.body.comments,
              stateId: state.id,
            })
              .then(
                createSuccess = (landmark) => {
          
                  res.json({
                    landmark: landmark,
                    message: 'landmark created'
                  })
                },
                createError = err => res.status(500).send(err)
              )
  
          },
          createError = err => res.status(500).send(err)
        )

    } else {
      
      // We have a state create the landmark
      Landmark.create({
        title: req.body.title,
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        dateLastVisited: req.body.dateLastVisited,
        imageURL: req.body.imageURL,
        comments: req.body.comments,
        stateId: state.id,
      })
        .then(
          createSuccess = (landmark) => {
    
            res.json({
              landmark: landmark,
              message: 'landmark created'
            })
          },
          createError = err => res.status(500).send(err)
        )
    }

  })

})

// Get users landmarks
// Get all user landmarks
router.get('/mylandmarks', validateSession, (req, res) => {
  Landmark.findAll({
    include: [
      {
        model: State,
        where:[{'user_id': req.user.id}],
      }
    ]
  })
    .then(landmarks => res.status(200).json(landmarks))
    .catch(err => res.status(500).json({ error: err }))
 });

// Update Landmark for current user
// Note: Same issue as create - Form only passes 2 character state code need 
// to get corresponding state_id or create new state for user



module.exports = router;