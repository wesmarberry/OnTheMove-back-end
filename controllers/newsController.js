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


// finds top newx headlines
router.get('/top', async (req, res) => {
	try {
		const response = await superagent.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=' + process.env.NEWS_API_KEY)
		console.log(response);
		res.json({
				status: 200,
				data: response,
				session: req.session
			})

	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}		
})

const generateKeyword = (string) => {
	const NewString = string.replace(/ /g,'%20')
	return NewString
}

// finds recommended news headlines
router.get('/recommended', async (req, res) => {
	try {
		const foundUser = await User.findById(req.body.userId)
		const randNum = Math.floor(Math.random() * foundUser.searches.length)
		const search = foundUser.searches[randNum]
		const formattedSearch = generateKeyword(search)
		const response = superagent.get('https://newsapi.org/v2/everything?q=' + formattedSearch + '&apiKey=' + process.env.NEWS_API_KEY)
		res.json({
			status: 200,
			data: response,
			session: req.session
		})

	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}
})

// creates news posts to view
router.post('/create', (req, res) => {
	try	{

	} catch (err) {

	}	
})





module.exports = router;