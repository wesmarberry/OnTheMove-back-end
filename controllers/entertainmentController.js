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
lat
lng

http://localhost:3679/api/v1/entertainment/find
*/
router.post('/find', async (req, res) => {
	try	{
		const foundUser = await User.findById(req.body.userId)
		foundUser.searches.push(req.body.search)
		foundUser.save()
		const input = generateKeyword(req.body.search)
		const apiCall = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + input + '&location=' + req.body.lat + ',' + req.body.lng + '&radius=4828.03&key=' + process.env.GOOGLE_API_KEY
		console.log(apiCall);
		const apiRes = await superagent.post(apiCall)
		console.log(apiRes);
		res.json({
	      status: 200,
	      data: apiRes,
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
		const foundUser = await User.findById(req.body.userId)
		console.log('found user');
		console.log(foundUser);
		const randNum = Math.floor(Math.random() * foundUser.searches.length)
		console.log(randNum);
		const related = []
		for (let i = 0; i < 3; i++) {
			const randNum = Math.floor(Math.random() * foundUser.searches.length)
			const search = foundUser.searches[randNum]
			const formattedSearch = generateKeyword(search)
			
			const apiCall = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + formattedSearch + '&location=' + req.body.lat + ',' + req.body.lng + '&radius=4828.03&key=' + process.env.GOOGLE_API_KEY
			console.log(apiCall);
			const apiRes = await superagent.post(apiCall)
			console.log(apiRes.body.results);
			const randNum2 = Math.floor(Math.random() * apiRes.body.results.length)
			related.push(apiRes.body.results[randNum2])

		}

		// console.log(search);
		// console.log(formattedSearch);
		// const wordApiCall = 'https://api.datamuse.com/words?ml=' + formattedSearch + '&max=20'
		// console.log(wordApiCall);
		// const wordApiRes = await superagent.post(wordApiCall)
		// console.log(wordApiRes);
		// const randNum2 = Matn.floor(Math.random() * wordApiCall.length)
		// const newSearch = generateKeyword(wordApiCall[randNum2].word)
		console.log(related);
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
		const foundUser = await User.findById(req.body.userId)
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

// deletes entertainment of user
router.delete('/:id'), async (req, res) => {
	try	{
		const deletedEntertainment = await Entertainment.findyByIdAndDelete(req.params.id)
		const foundUser = await User.findById(deletedEntertainment.userId)
		const index = foundUser.entertainment.indexOf(deletedEntertainment._id)
		foundUser.entertainment.splice(index, 1)
		foundUser.save()
		res.json({
			status: 200,
			data: deletedEntertainment,
			user: foundUser,
			session: req.session
		})	

	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}

}












module.exports = router;