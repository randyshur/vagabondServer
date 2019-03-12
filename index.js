require('dotenv').config();
const express = require('express');
const app = express();

const sequelize = require('./db');
const bodyParser = require('body-parser');

// Need controllers nere
const user = require('./controllers/usercontroller');

sequelize.sync();
app.use(bodyParser.json());
app.use(require('./middleware/headers'));

// Need api calls here 
app.use('/api/user', user)

app.get('/', (req, res) => res.sendfile('index.html'));

app.listen(process.env.PORT,() => console.log(` ${process.env.NAME} is listening on ${process.env.PORT}`));