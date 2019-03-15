const router = require('express').Router();
const Landmark = require('../db').import('../models/landmark');


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

module.exports = router;