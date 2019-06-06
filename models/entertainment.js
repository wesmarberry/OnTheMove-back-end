const mongoose = require('mongoose');
const Entertainment = require('./entertainment');
const Review = require('./review');

const EntertainmentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	formatted_address: String,
	lat: Number,
	lng: Number,
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	date: String,
	userId: String,
	apiId: String
});



module.exports = mongoose.model('Entertainment', EntertainmentSchema);