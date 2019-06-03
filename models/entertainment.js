const mongoose = require('mongoose');
const Entertainment = require('./entertainment');

const EntertainmentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	completed: {type: Boolean, default: false,
	time: String,
	userId: String
});



module.exports = mongoose.model('Entertainment', EntertainmentSchema);