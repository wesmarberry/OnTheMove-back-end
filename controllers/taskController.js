const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const bcrypt = require('bcryptjs');





// create task route
// endpoint: /api/v1/task
// req.body reqirements: description, priority, time, userId, date
router.post('/', async (req, res) => {
	try	{
		
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

// edit task
// endpoint: /api/v1/task/{task id}/edit
router.put('/:id/edit', async (req, res) => {
	try {
		
		
		const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
		
		const foundUser = await User.findById(updatedTask.userId).populate('tasks')

		res.json({
			status: 200,
			data: updatedTask,
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


// converts a raw date in the form "2019-06-12" to a number
convertDateToNumber = (date) => {
    const newDate = date.split('-').join('')
    const numDate = Number(newDate)
    return numDate
  }

// gets the current date in raw form ie. "2019-06-12"
getCurrentDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }


// updates all tasks that have not been marked as completed and were created before the current date
// with the current date
// endpoint: /api/v1/task/updateall
router.put('/updateall', async (req, res) => {
	try {
		// finds all tasks
		const allTasks = await Task.find({})
		
		for (let i = 0; i < allTasks.length; i++) {
			//conditional to check if task[i] has been marked completed and has been created before the current date
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
		res.json({
			status: 400,
			data: err
		})
	}	
})

// deletes a task
// endpoint: /api/v1/task/{task id}

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