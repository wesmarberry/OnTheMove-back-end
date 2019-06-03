const mongoose = require('mongoose');
const Task = require('./task');

const TaskSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	priority: String,
	completed: Boolean,
	time: String,
	userId: String
});



module.exports = mongoose.model('Task', TaskSchema);