const mongoose = require('mongoose');


const NewsSchema = new mongoose.Schema({
	content: String,
	description: String,
	author: String,
	title: String,
	publishedDate: String,
	image: String,
	userId: String,
	url: String
});



module.exports = mongoose.model('News', NewsSchema);