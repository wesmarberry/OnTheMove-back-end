const mongoose = require('mongoose');
const Task = require('./task');

const TaskSchema = new mongoose.Schema({
	title: String,
	description: {type: String, required: true},
	priority: String,
	completed: {type: String, default: 'false'},
	time: String,
	date: String,
	userId: String
});



module.exports = mongoose.model('Task', TaskSchema);