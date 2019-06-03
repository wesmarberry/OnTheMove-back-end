const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const cors           = require('cors');
const session        = require('express-session')
require('dotenv').config();
require('./db/db');

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.REACT_CLIENT_URL, // when you deploy your react app, this is where you put the address,
  credentials: true, // allowing cookies to be sent with requests from the client (session cookie),
  optionsSuccessStatus: 200 // some legacy browsers IE11 choke on a 204, and options requests
}

app.use(cors(corsOptions));


const userController  = require('./controllers/userController');
const taskController  = require('./controllers/taskController');
const entertainmentController  = require('./controllers/entertainmentController');
const podcastController  = require('./controllers/podcastController');
const newsController  = require('./controllers/newsController');

app.use('/api/v1/task', taskController);
app.use('/api/v1/user', userController);
app.use('/api/v1/entertainment', entertainmentController);
app.use('/api/v1/podcast', podcastController);
app.use('/api/v1/news', newsController);

app.listen(process.env.PORT, () => {
  console.log('listening on port '  + process.env.PORT);
});