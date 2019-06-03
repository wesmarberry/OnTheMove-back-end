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


module.exports = router;