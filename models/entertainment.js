const mongoose = require('mongoose');
const Entertainment = require('./entertainment');

const EntertainmentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	completed: Boolean,
	time: String,
	userId: String
});



module.exports = mongoose.model('Entertainment', EntertainmentSchema);