const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/task');
const Entertainment = require('../models/entertainment');
const bcrypt = require('bcryptjs');
const superagent = require('superagent');






// generates the necessary syntax for the api call
const generateKeyword = (string) => {
	const NewString = string.replace(/ /g,'+')
	return NewString
}

// api call to search for activities based on user search
/*
req.body needs:
userId
search


/api/v1/entertainment/find
*/
router.post('/find', async (req, res) => {
	try	{
		// finds the user in order to save the searches
		const foundUser = await User.findById(req.body.userId)
		// pushes the user's search into their searches
		foundUser.searches.push(req.body.search)
		foundUser.save()
		// formats the search for the api call
		const input = generateKeyword(req.body.search)
		const apiCall = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&location=' + foundUser.lat + ',' + foundUser.lng + '&radius=4828.03&key=' + process.env.GOOGLE_API_KEY
		
		const apiRes = await superagent.post(apiCall)
		
		res.json({
	      status: 200,
	      data: apiRes.body.results,
	      user: foundUser,
	      session: req.session
	    });
	} catch (err) {
		res.json({
	    	status: 400,
	    	data: 'Error'
	    })
	}
})

// finds related entertainment based on past user searches
// endpoint: /api/v1/entertainment/related
// req.body requirements: userId
router.post('/related', async (req, res) => {
	try	{
		
		const foundUser = await User.findById(req.body.userId)
		
		let related = []
		// if the user has no searches then nearby restaurants are found
		if (foundUser.searches.length !== 0) {
			for (let i = 0; i < 5; i++) {

				let search = null
				while (search === null) {
					const randNum = Math.floor(Math.random() * foundUser.searches.length)

					search = foundUser.searches[randNum]
					
				}
				const formattedSearch = generateKeyword(search)
				
				const apiCall = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + formattedSearch + '&location=' + foundUser.lat + ',' + foundUser.lng + '&radius=4828.03&key=' + process.env.GOOGLE_API_KEY
				
				const apiRes = await superagent.post(apiCall)
				// if places are found then one is picked at random and pushed into the results array
				if (apiRes.body.results.length > 0) {
					const randNum2 = Math.floor(Math.random() * apiRes.body.results.length)
					if (related.includes(apiRes.body.results[randNum2]) === false) {
						related.push(apiRes.body.results[randNum2])
						
					}
					
				}

			}
			
		} else {
			
			const apiCall = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + foundUser.lat + ',' + foundUser.lng + '&radius=4828.03&type=restaurant&key=' + process.env.GOOGLE_API_KEY
			
			const apiRes = await superagent.post(apiCall)
			related = apiRes.body.results
			
		}

		res.json({
	      status: 200,
	      data: related,
	      user: foundUser,
	      session: req.session
	    });
	} catch (err) {
		res.json({
	      status: 400,
	      data: err
	    });
	}
})

// creates activity for the user
// endpoint: /api/v1/entertainment/add
// req.body requirements: name, lat, lng, date, userId, apiId, formatted_address
router.post('/add', async (req, res) => {
	try {
		
		const foundUser = await User.findById(req.body.userId).populate('entertainment')
		
		const createdEntertainment = await Entertainment.create(req.body)
		foundUser.entertainment.push(createdEntertainment)
		foundUser.save()
		res.json({
	      status: 200,
	      data: createdEntertainment,
	      user: foundUser,
	      session: req.session
	    });
	} catch (err) {
		res.json({
	      status: 400,
	      data: err
	    });
	}	
})

// creates custom entertainment
// endpoint: /api/v1/entertainment/custom
// req.body requirements: userId, customEnt (search), date
router.post('/custom', async (req, res) => {
	try {
		
		const foundUser = await User.findById(req.body.userId)
		const entDbEntry = {}
		entDbEntry.name = req.body.customEnt
		entDbEntry.userId = req.body.userId
		entDbEntry.date = req.body.date
		const createdEntertainment = await Entertainment.create(entDbEntry)
		foundUser.entertainment.push(createdEntertainment)
		foundUser.searches.push(req.body.customEnt)
		foundUser.save()
		res.json({
	      status: 200,
	      data: createdEntertainment,
	      user: foundUser,
	      session: req.session
	    });
	} catch (err) {
		res.json({
	      status: 400,
	      data: err
	    });
	}	
})

// deletes entertainment of user
// endpoint: /api/v1/entertainment/{entertainment Id}
router.delete('/:id', async (req, res) => {
	try	{
		const foundEntertainment = await Entertainment.findById(req.params.id)
		
		const deletedEntertainment = await Entertainment.findByIdAndDelete(req.params.id)
		
		const foundUser = await User.findById(foundEntertainment.userId)
		
		const index = foundUser.entertainment.indexOf(foundEntertainment._id)
		foundUser.entertainment.splice(index, 1)
		foundUser.save()
		res.json({
			status: 200,
			data: foundEntertainment,
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












module.exports = router;