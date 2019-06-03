const mongoose = require('mongoose');
const Review = require('./review');

const PodcastSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	image: String,
	episodes: Array,
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	userId: String,
	apiId: String
});



module.exports = mongoose.model('Podcast', PodcastSchema);