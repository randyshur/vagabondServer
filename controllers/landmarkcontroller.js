const router = require('express').Router();
const User = require('../db').import('../models/user');
const State = require('../db').import('../models/state');
const Landmark = require('../db').import('../models/landmark');
// Landmark.sync({force:true})

State.belongsTo(User);
Landmark.belongsTo(State);

// Create Landmark
router.post('/', (req, res) => {

  Landmark.create({
    title: req.body.landmark.title,
    address: req.body.landmark.address,
    city: req.body.landmark.city,
    zip: req.body.landmark.zip,
    latitude: req.body.landmark.latitude,
    longitude: req.body.landmark.longitude,
    dateLastVisited: req.body.landmark.dateLastVisited,
    imageURL: req.body.landmark.imageURL,
    comments: req.body.landmark.comments,
    stateId: req.body.landmark.stateId,
    // owner: req.user.id
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

})

// Get all landmarks
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

// Get all user landmarks
router.get('/user/', (req, res) => {
  Landmark.findAll({ 
    include: [
      {
        model: State,
        where: {owner: req.user.id},
        include: [
          {
            model: User,
            
          }
        ],
        
      }
    ]
  })
    .then(landmarks => res.status(200).json(landmarks))
    .catch(err => res.status(500).json({ error: err }))
});

// Get single landmark by id for updating
router.get('/id/:id', (req, res) => {
  Landmark.findOne({where: {id: req.params.id}})
  .then(landmark => res.status(200).json(landmark))
  .catch(err => res.status(500).json(err))
});

// Update landmark
router.put('/:id', (req, res) => {
  if (!req.errors) {
    Landmark.update(req.body.landmark, { where: { id: req.params.id }})
      .then(landmark => res.status(200).json(landmark))
      .catch(err => res.json(err))
  } else {
    res.status(500).json(req.errors)
  }
})

// Delete state
router.delete('/:id', (req, res) => {
  if (!req.errors) {
    Landmark.destroy({ where: { id: req.params.id }})
      .then(landmark => res.status(200).json(landmark))
      .catch(err => res.json(req.errors))
  } else {
    res.status(500).json(req.errors)
  }
})

module.exports = router;