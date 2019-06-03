const mongoose = require('mongoose');
const Entertainment = require('./entertainment');
const Review = require('./review');

const EntertainmentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	completed: {type: Boolean, default: false},
	lat: Number,
	lng: Number,
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	time: String,
	userId: String
});



module.exports = mongoose.model('Entertainment', EntertainmentSchema);