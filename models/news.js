const mongoose = require('mongoose');


const NewsSchema = new mongoose.Schema({
	body: String,
	rating: String,
	username: String,
	userId: String,
	activityId: String,
	activityApiId: String
});



module.exports = mongoose.model('News', NewsSchema);