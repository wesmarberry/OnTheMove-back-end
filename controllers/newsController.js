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
		console.log(response.body.articles);
		res.json({
				status: 200,
				data: response.body.articles,
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
	const NewString = string.replace(/ /g,'+')
	return NewString
}

// finds recommended news headlines
router.get('/:id/recommended', async (req, res) => {
	try {
		console.log('hitting recommended');
		const foundUser = await User.findById(req.params.id)
		console.log(foundUser);
		const results = []
		for (let i = 0; i < 5; i++) {
			const randNum = Math.floor(Math.random() * foundUser.searches.length)
			console.log(randNum);
			const search = foundUser.searches[randNum]
			console.log(search);
			const formattedSearch = generateKeyword(search)
			const response = await superagent.get('https://newsapi.org/v2/everything?q=' + formattedSearch + '&apiKey=' + process.env.NEWS_API_KEY)
			console.log(response.body.articles);
			const randNum2 = Math.floor(Math.random() * response.body.articles.length)
			console.log(response.body.articles.length);
			results.push(response.body.articles[randNum2])
		}
		res.json({
			status: 200,
			data: results,
			session: req.session
		})

	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}
})

router.get('/:search/:id/search', async (req, res) => {
	try {
		formattedSearch = generateKeyword(req.params.search)
		const foundUser = await User.findById(req.params.id)
		foundUser.searches.push(req.params.search)
		const response = await superagent.get('https://newsapi.org/v2/everything?q=' + formattedSearch + '&apiKey=' + process.env.NEWS_API_KEY)
		res.json({
			status: 200,
			data: response.body.articles,
			session: req.session
		})
	} catch (err) {

	}	
})


// creates news posts to view
router.post('/add', async (req, res) => {
	try	{
		const createdNews = await News.create(req.body)
		const foundUser = await User.findById(req.body.userId)
		foundUser.news.push(createdNews)
		foundUser.save()
		res.json({
			status: 200,
			data: createdNews,
			user: foundUser,
			session: req.session
		})
	} catch (err) {

	}	
})

router.delete('/:id', async (req, res) => {
	try {
		const deletedNews = await News.findByIdAndDelete(req.params.id)
		res.json({
				status: 200,
				data: deletedNews,
				session: req.session
		})
	} catch (err) {

	}
})





module.exports = router;