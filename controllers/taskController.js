const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const bcrypt = require('bcryptjs');





// create task route

router.post('/', async (req, res) => {
	try	{
		console.log(req.body);
		const createdTask = await Task.create(req.body)
		const foundUser = await User.findById(req.body.userId)
		foundUser.tasks.push(createdTask)
		foundUser.save()
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
		console.log(req.body);
		const name = req.body.name
		const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
		console.log(updatedTask);
		const foundUser = await User.findById(updatedTask.userId).populate('tasks')

		res.json({
			status: 200,
			data: updatedTask,
			user: foundUser,
			session: req.session
		})

	} catch (err) {

	}
})

router.put('/:id/updatedate', (req, res) => {
	try {
		const updatedTask = Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
		res.json({
			status: 200,
			data: updatedTask,
			session: req.session
		})
	} catch (err) {

	}
})

convertDateToNumber = (date) => {
    const newDate = date.split('-').join('')
    const numDate = Number(newDate)
    return numDate
  }

getCurrentDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }

router.put('/updateall', async (req, res) => {
	try {
		console.log('running update all');
		const allTasks = await Task.find({})
		console.log(allTasks);
		for (let i = 0; i < allTasks.length; i++) {
			if (convertDateToNumber(allTasks[i].date) < convertDateToNumber(getCurrentDate()) && allTasks[i].completed === 'false') {
				allTasks[i].date = getCurrentDate()
				allTasks[i].save()
			}
		}
		res.json({
			status: 200,
			data: allTasks,
			session: req.session
		})	
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