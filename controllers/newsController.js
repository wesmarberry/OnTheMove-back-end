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
// endpoint: /api/v1/news/top
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


// formats the searches to be accepted by the API call
const generateKeyword = (string) => {
	const NewString = string.replace(/ /g,'+')
	return NewString
}

// finds 5 recommended news headlines
// endpoint: /api/v1/news/{user Id}/recommended
router.get('/:id/recommended', async (req, res) => {
	try {
		
		const foundUser = await User.findById(req.params.id)
		
		const results = []

		for (let i = 0; i < 5; i++) {
			const randNum = Math.floor(Math.random() * foundUser.searches.length)
			
			// finds a random search from the user
			const search = foundUser.searches[randNum]
			
			const formattedSearch = generateKeyword(search)
			const response = await superagent.get('https://newsapi.org/v2/everything?q=' + formattedSearch + '&apiKey=' + process.env.NEWS_API_KEY)
			
			const randNum2 = Math.floor(Math.random() * response.body.articles.length)
			
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


// users can search for news articles based on keyword
// endpoint: /api/v1/news/{search parameter}/{user Id}/search
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
		res.json({
			status: 400,
			data: err
		})
	}	
})

// Shows an individual news article
// endpoint: /api/v1/news/{article Id}
router.get('/:id', async (req, res) => {
	try {
		console.log('hit show');
		const foundNews = await News.findById(req.params.id)
		console.log(foundNews);
		res.json({
			status: 200,
			data: foundNews,
			session: req.session
		})
	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}		
})

// creates news news articles
// endpoint: /api/v1/news/add
// req.body requirements: content, description, author, publishedDate, userId, image, title, url
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
		res.json({
			status: 400,
			data: err
		})
	}	
})


// deletes articles
// endpoint: /api/v1/news/{article Id}
router.delete('/:id', async (req, res) => {
	try {
		const deletedNews = await News.findByIdAndDelete(req.params.id)
		res.json({
				status: 200,
				data: deletedNews,
				session: req.session
		})
	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}
})





module.exports = router;