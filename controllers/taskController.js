const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const bcrypt = require('bcryptjs');



// create task route

router.post('/', async (req, res) => {
	try	{
		const createdTask = await Task.create(req.body)
		const foundUser = await User.findById(req.body.userId)
		foundUser.tasks.push(createdTask)
		res.json({
			status: 200,
			data: createdTask,
			user: foundUser,
			session: req.session
		})
	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}
})

// edit 

router.put('/:id/edit', async (req, res) => {
	try {
		const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true})



	} catch (err) {

	}
})

// delete

router.delete('/:id'), async (req, res) => {
	try	{
		const deletedTask = await Task.findyByIdAndDelete(req.params.id)
		const foundUser = await Task.findById(deletedTask.userId)
		const index = foundUser.tasks.indexOf(deletedTask._id)
		foundUser.tasks.splice(index, 1)
		foundUser.save()
		res.json({
			status: 200,
			data: deletedTask,
			user: foundUser,
			session: req.session
		})	

	} catch (err) {
		res.json({
			status: 400,
			data: err
		})
	}

}


module.exports = router;