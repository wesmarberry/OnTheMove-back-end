const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/task');
const Entertainment = require('../models/entertainment');
const Podcast = require('../models/podcast');
const bcrypt = require('bcryptjs');

const superagent = require('superagent');
var unirest = require('unirest');


// finds popular podcasts
router.get('/popular', async (req, res) => {
	try {

		const response = await unirest.get('https://listen-api.listennotes.com/api/v2/best_podcasts?page=1&region=us&safe_mode=1').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
		newResponse = response.toJSON();
		console.log(newResponse);
	const podcastIds = []
	for (let i = 0; i < 3; i++) {
		const randNum = Math.floor(Math.random() * newResponse.body.podcasts.length)
		console.log(newResponse.body.podcasts.length);
		podcastIds.push(newResponse.body.podcasts[randNum])
		console.log('==========================');
		console.log(newResponse.body.podcasts[randNum]);
		// const idResponse = await unirest.get('https://listen-api.listennotes.com/api/v2/podcasts/' + newResponse.body.podcasts[randNum].id + '?sort=recent_first').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
		// const newIdResponse = idResponse.toJSON();
		// console.log(newIdResponse);
		// podcastIds[i].searched = newIdResponse
	}
	res.json({
		status: 200,
		data: podcastIds,
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

// searches for podcasts
router.get('/find/:search/:userid', async (req, res) => {
	try {
		console.log('starting searching');
		console.log(req.body);
		const foundUser = await User.findById(req.params.userid)
		foundUser.searches.push(req.params.search)
		foundUser.save()
		const formattedSearch = generateKeyword(req.params.search)
		const response = await unirest.get('https://listen-api.listennotes.com/api/v2/search?q=' + formattedSearch + '&sort_by_date=0&type=podcast&offset=0&len_min=10&len_max=30&&only_in=title%2Cdescription&language=English&safe_mode=1').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
		const newResponse = response.toJSON()
		res.json({
			status: 200,
			data: newResponse,
			session: req.session
		})	
	} catch (err) {

	}
})

router.get('/:id/:userid/create', async (req, res) => {
	try {
		console.log('starting podcast create');
		console.log(req.params);
		const idResponse = await unirest.get('https://listen-api.listennotes.com/api/v2/podcasts/' + req.params.id + '?sort=recent_first').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)

		const newIdResponse = idResponse.toJSON()
		console.log(newIdResponse);
		const podcastDbEntry = {}
		podcastDbEntry.name = newIdResponse.body.title
		podcastDbEntry.description = newIdResponse.body.description
		podcastDbEntry.image = newIdResponse.body.image
		podcastDbEntry.episodes = newIdResponse.body.episodes
		podcastDbEntry.userId = req.params.userid
		podcastDbEntry.apiId = newIdResponse.body.id
		console.log('====================');
		console.log(podcastDbEntry);
		const createdPodcast = await Podcast.create(podcastDbEntry)
		console.log(createdPodcast);
		console.log('created a podcast');
		const foundUser = await User.findById(createdPodcast.userId)
		foundUser.podcasts.push(createdPodcast)
		foundUser.save()
		res.json({
			status: 200,
			data: createdPodcast,
			user: foundUser,
			session: req.session
		})	

	} catch (err) {

	}
})	

// finds recommended podcasts 
router.get('/recommended/:id', async (req, res) => {
	try {
		const foundUser = await User.findById(req.params.id).populate('podcasts')
		console.log(foundUser);
		if (foundUser.podcasts.length !== 0) {
			console.log('ran recommendations');
			const randNum = Math.floor(Math.random() * foundUser.podcasts.length)
			const id = foundUser.podcasts[randNum].apiId
			const response = await unirest.get('https://listen-api.listennotes.com/api/v2/podcasts/' + id + '/recommendations?safe_mode=1').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
			const newResponse = response.toJSON()
			res.json({
				status: 200,
				data: newResponse,
				user: foundUser,
				session: req.session
			})
			
		} else if (foundUser.searches.length !== 0) {
			const randNum = Math.floor(Math.random() * foundUser.searches.length)
			const search = foundUser.searches[randNum]
			const formattedSearch = generateKeyword(search)
			const response = await unirest.get('https://listen-api.listennotes.com/api/v2/search?q=' + formattedSearch + '&sort_by_date=0&type=podcast&offset=0&len_min=10&len_max=30&&only_in=title%2Cdescription&language=English&safe_mode=1').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
			const newResponse = response.toJSON()
			res.json({
				status: 200,
				data: newResponse,
				user: foundUser,
				session: req.session
			})
		}
	} catch (err) {

	}	
})

router.get('/:id', async (req, res) => {
	try {
		console.log('started showpodcast');
		console.log(req.params.id);
		const foundPodcast = await Podcast.findById(req.params.id)
		res.json({
				status: 200,
				data: foundPodcast,
				session: req.session
			})

	} catch (err) {

	}	
})

router.delete('/:id', async (req, res) => {
	try {
		const deletedPodcast = await Podcast.findByIdAndDelete(req.params.id)
		res.json({
				status: 200,
				data: deletedPodcast,
				session: req.session
		})
	} catch (err) {

	}
})




module.exports = router;