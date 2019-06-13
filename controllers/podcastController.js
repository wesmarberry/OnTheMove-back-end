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
// endpoint: /api/v1/podcast/popular
router.get('/popular', async (req, res) => {
	try {

		const response = await unirest.get('https://listen-api.listennotes.com/api/v2/best_podcasts?page=1&region=us&safe_mode=1').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
		newResponse = response.toJSON();
		
		const podcastIds = []
		// finds 10 popular podcasts and pushes them into the podcastIds array
		for (let i = 0; i < 10; i++) {
			const randNum = Math.floor(Math.random() * newResponse.body.podcasts.length)
			
			podcastIds.push(newResponse.body.podcasts[randNum])
			
			
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

// generates a formatted keyword to be used in the podcast search
const generateKeyword = (string) => {
	const NewString = string.replace(/ /g,'%20')
	return NewString
}

// searches for podcasts
// endpoint: /api/v1/podcast/find/{search parameter}/{user Id}
router.get('/find/:search/:userid', async (req, res) => {
	try {
		
		// finds the user searching
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
		res.json({
			status: 400,
			data: err
		})
	}
})

// creates user podcasts
// endpoint: /api/v1/podcast/{podcast id}/{user id}/create
router.get('/:id/:userid/create', async (req, res) => {
	try {
		console.log('starting podcast create');
		console.log(req.params);
		const idResponse = await unirest.get('https://listen-api.listennotes.com/api/v2/podcasts/' + req.params.id + '?sort=recent_first').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)

		const newIdResponse = idResponse.toJSON()
		

		// outlines the api response data needed to create the podcast
		const podcastDbEntry = {}
		podcastDbEntry.name = newIdResponse.body.title
		podcastDbEntry.description = newIdResponse.body.description
		podcastDbEntry.image = newIdResponse.body.image
		podcastDbEntry.episodes = newIdResponse.body.episodes
		podcastDbEntry.userId = req.params.userid
		podcastDbEntry.apiId = newIdResponse.body.id
		
		const createdPodcast = await Podcast.create(podcastDbEntry)
		
		// adds the created podcast to the user
		const foundUser = await User.findById(createdPodcast.userId)
		foundUser.podcasts.push(createdPodcast)
		foundUser.podcastIds.push(createdPodcast.apiId)
		foundUser.save()

		res.json({
			status: 200,
			data: createdPodcast,
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

// finds recommended podcasts 
// endpoint: /api/v1/podcast/recommended/{user id}
router.get('/recommended/:id', async (req, res) => {
	try {
		const foundUser = await User.findById(req.params.id).populate('podcasts')
		// if the user has added a podcast then the API is called to recommend podcasts
		if (foundUser.podcastIds.length !== 0) {
			// finds a random user podcast ID to generate recommendations from 
			const randNum = Math.floor(Math.random() * foundUser.podcastIds.length)
			const id = foundUser.podcastIds[randNum]
			const response = await unirest.get('https://listen-api.listennotes.com/api/v2/podcasts/' + id + '/recommendations?safe_mode=1').header('X-ListenAPI-Key', process.env.PODCAST_API_KEY)
			const newResponse = response.toJSON()
			res.json({
				status: 200,
				data: newResponse,
				user: foundUser,
				session: req.session
			})
			
		} else if (foundUser.searches.length !== 0) { // if the user has never added a podcast then it generates recommendation based on the user's searches
			const randNum = Math.floor(Math.random() * foundUser.searches.length)
			// gets a random user search from the user
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
		res.json({
			status: 400,
			data: err
		})
	}	
})

// shows a podcast
// endpoint: /api/v1/{podcast id}
router.get('/:id', async (req, res) => {
	try {
		
		const foundPodcast = await Podcast.findById(req.params.id)
		res.json({
				status: 200,
				data: foundPodcast,
				session: req.session
			})

	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}	
})

// deletes a podcast
// endpoint: /api/v1/{podcast id}
router.delete('/:id', async (req, res) => {
	try {
		const deletedPodcast = await Podcast.findByIdAndDelete(req.params.id)
		res.json({
				status: 200,
				data: deletedPodcast,
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