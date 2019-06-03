const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/task');
const Entertainment = require('../models/entertainment');
const bcrypt = require('bcryptjs');
const superagent = require('superagent');




module.exports = router;