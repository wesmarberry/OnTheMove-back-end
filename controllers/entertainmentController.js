const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/task');
const Entertainment = require('../models/entertainment');
const bcrypt = require('bcryptjs');
const superagent = require('superagent');






// if the "other" category is filled out with spaces, it replaces the spaces with an underscore
// this is necessary for the syntax of the API call
const generateKeyword = (string) => {
	const NewString = string.replace(/ /g,'+')
	return NewString
}

// api call to get activities
/*
req.body needs:
userId
search


http://localhost:3679/api/v1/entertainment/find
*/
router.post('/find', async (req, res) => {
	try	{
		const foundUser = await User.findById(req.body.userId)
		foundUser.searches.push(req.body.search)
		foundUser.save()
		const input = generateKeyword(req.body.search)
		const apiCall = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&location=' + foundUser.lat + ',' + foundUser.lng + '&radius=4828.03&key=' + process.env.GOOGLE_API_KEY
		console.log(apiCall);
		const apiRes = await superagent.post(apiCall)
		console.log(apiRes);
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


router.post('/related', async (req, res) => {
	try	{
		console.log('starting related');
		console.log(req.body);
		const foundUser = await User.findById(req.body.userId)
		console.log('found user');
		console.log(foundUser);
		let related = []
		if (foundUser.searches.length !== 0) {
			for (let i = 0; i < 5; i++) {

				let search = null
				while (search === null) {
					const randNum = Math.floor(Math.random() * foundUser.searches.length)

					search = foundUser.searches[randNum]
					
				}
				const formattedSearch = generateKeyword(search)
				
				const apiCall = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + formattedSearch + '&location=' + foundUser.lat + ',' + foundUser.lng + '&radius=4828.03&key=' + process.env.GOOGLE_API_KEY
				console.log(apiCall);
				const apiRes = await superagent.post(apiCall)
				console.log(apiRes.body.results);
				if (apiRes.body.results.length > 0) {
					const randNum2 = Math.floor(Math.random() * apiRes.body.results.length)
					if (related.includes(apiRes.body.results[randNum2]) === false) {
						related.push(apiRes.body.results[randNum2])
						
					}
					
				}

			}
			
		} else {
			console.log('hit else');
			const apiCall = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + foundUser.lat + ',' + foundUser.lng + '&radius=4828.03&type=restaurant&key=' + process.env.GOOGLE_API_KEY
			console.log(apiCall);
			const apiRes = await superagent.post(apiCall)
			related = apiRes.body.results
			console.log(related);
			console.log('this is related');
		}

		// console.log(search);
		// console.log(formattedSearch);
		// const wordApiCall = 'https://api.datamuse.com/words?ml=' + formattedSearch + '&max=20'
		// console.log(wordApiCall);
		// const wordApiRes = await superagent.post(wordApiCall)
		// console.log(wordApiRes);
		// const randNum2 = Matn.floor(Math.random() * wordApiCall.length)
		// const newSearch = generateKeyword(wordApiCall[randNum2].word)
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
router.post('/add', async (req, res) => {
	try {
		console.log('hitting add');
		console.log(req.body);
		const foundUser = await User.findById(req.body.userId).populate('entertainment')
		// const entDbEntry = {}
		// entDbEntry.name = req.body.name.value
		// entDbEntry.lat = req.body.lat.value
		// entDbEntry.lng = req.body.lng.value
		// entDbEntry.date = req.body.date.value
		// entDbEntry.userId = req.body.userId.value
		// entDbEntry.apiId = req.body.apiId.value
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
router.post('/custom', async (req, res) => {
	try {
		console.log('started Custom');
		console.log(req.body);
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

	}	
})

// deletes entertainment of user
router.delete('/:id', async (req, res) => {
	try	{
		const foundEntertainment = await Entertainment.findById(req.params.id)
		console.log(foundEntertainment);
		const deletedEntertainment = await Entertainment.findByIdAndDelete(req.params.id)
		console.log(deletedEntertainment);
		const foundUser = await User.findById(foundEntertainment.userId)
		console.log(foundUser);
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