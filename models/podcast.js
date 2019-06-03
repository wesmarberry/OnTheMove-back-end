const mongoose = require('mongoose');
const Review = require('./review');

const PodcastSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	audio: String,
	image: String,
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	userId: String,
	apiId: String
});



module.exports = mongoose.model('Entertainment', EntertainmentSchema);