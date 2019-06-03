const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/task');
const Entertainment = require('../models/entertainment');
const Podcast = require('../models/podcast');
const News = require('../models/news')
const bcrypt = require('bcryptjs');

const superagent = require('superagent');
var unirest = require('unirest');








module.exports = router;