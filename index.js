require('dotenv').config();
const express = require('express');
const app = express();

const sequelize = require('./db');
const bodyParser = require('body-parser');

// controllers 
const user = require('./controllers/usercontroller');
const state = require('./controllers/statecontroller');
const landmark = require('./controllers/landmarkcontroller');

sequelize.sync();
app.use(bodyParser.json());
app.use(require('./middleware/headers'));

// home route will go here
app.use('/api/user', user)

app.use(require('./middleware/validateSession'))
app.use('/api/state', state)
app.use('/api/landmark', landmark)

app.get('/', (req, res) => res.sendfile('index.html'));

app.listen(process.env.PORT,() => console.log(` ${process.env.NAME} is listening on ${process.env.PORT}`));