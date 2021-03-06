const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/task');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')




// route to register a new user (creates a new user)
// endpoint: /api/v1/user/register
// req.body requirements: lat, lng, email, username, password
router.post('/register', async (req, res, next) => {

	// first we must hash the password
	const password = req.body.password;
	// the password has is what we want to put in the database

	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

  



	// create and object for the db entry
	const userDbEntry = {};
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash;
	userDbEntry.email = req.body.email;
	// sets the lat lng based on the client retreived location
	userDbEntry.lat = req.body.lat
	userDbEntry.lng = req.body.lng


  

  try {


  		// creates user based on DB entry
	    const createdUser = await User.create(userDbEntry)


	    // sets session properties
	    req.session.logged = true;
	    req.session.userDbId = createdUser._id
	    req.session.username = createdUser.username
	    req.session.email = createdUser.email
	    req.session.lat = createdUser.lat
	    req.session.lng = createdUser.lng



	    res.json({
	      status: 200,
	      data: 'registration successful',
	      session: req.session
	    });
	  
	}
	catch (err) { // error message shows when all fields arent filled out
	    res.json({
	    	status: 400,
	    	data: 'Please fill out all required fields'
	    })
	}
})


const mailer = async (receiverEmail, password) => {

    try {
		// sets up transporter based on email that was made for this purpose
	    let transporter = await nodemailer.createTransport({
	        service: 'gmail',
	        host: 'smtp.gmail.com',
	        auth: {
	            user: 'onthmovereset@gmail.com',
	            pass: 'OnThMove1994'
	        },
	    })
	    // sets up email info based on parameters
	    let info = await transporter.sendMail({
	        from: receiverEmail,
	        to: receiverEmail,
	        subject: 'OnThMove Password Reset',
	        text: 'Your password for OnThMove has been reset! Please be sure to log on and update your password to your own custom password. Your temporary password is: ' + password
	    })
	    console.log("Message sent: %s", info);

    } catch (err) {
    	console.log(err);
    }
}

const generateRandomNumber = () => {
	let password = ''
	for (let i = 0; i < 3; i++) {

		const number = Math.floor(Math.random() * 1000)
		password += number + 'G'
	}
	return password
}


router.post('/reset', async (req, res) => {
	
	try {
		const emailExists = await User.findOne({'email': req.body.emailToSend})
		
		if (emailExists) {
			
			const password = generateRandomNumber()
			
			mailer(req.body.emailToSend, password)
			const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			
			emailExists.password = passwordHash
			emailExists.save()
			
			res.json({
		      status: 200,
		      data: 'Your Password Has Been Reset',
		      session: req.session
		    });


		} else {
			req.session.message = 'No user with that email exisits'
			res.status(400).json({
				status: 400,
				data: req.session.message
			})
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({
				status: 400,
				data: err
			})
	}	
})


// logs in existing users
// endpoint: /api/v1/user/new
// req.body requirements: username, password, lat, lng
router.post('/new', async (req, res, next) => {

  try {
  	// finds user if user exists
    const userExists = await User.findOne({'username': req.body.username})
    console.log(userExists);
    // tests if user exists and sets the session properties
    if (userExists && userExists.password) {
    	// tests if the password is correct
      if (bcrypt.compareSync(req.body.password, userExists.password)) {
      	// if the password is correct set the session properties

      	
      	// resets the users lat and lng based on client retreived data
      	userExists.lat = req.body.lat
      	userExists.lng =req.body.lng
      	userExists.save()
      	
        req.session.userDbId = userExists._id
        req.session.logged = true
        req.session.username = req.body.username
        req.session.email = userExists.email
        req.session.message = ''
        req.session.lat = req.body.lat
	    req.session.lng = req.body.lng

        res.json({
	      status: 200,
	      data: 'login successful',
	      session: req.session
	    });
        
      } else {// message to be displayed if the username or password doesnt match
        req.session.message = 'username or password is incorrect'
        res.status(400).json({
			status: 400,
			data: req.session.message
		})
      }
    } else {// message to be displayed if the user doesnt exitst
      req.session.message = "username or password does not exist"
      res.status(400).json({
			status: 400,
			data: req.session.message
		})
    }
    
  } catch (err) {

    res.status(400).json({
		status: 400,
		error: err
	})
  }

})  

// logout route, destroys session
// endpoint: /api/v1/user/logout
router.get('/logout', (req, res, next) => {
	try {
		req.session.destroy()
		res.json({
			status: 200,
			data: "log out successful"
		})

	} catch (err) {
		res.status(400).json({
			status: 400,
			error: err
		})
	}
})




// index route
// finds all the users and all the activities
// endpoint: /api/v1/user
router.get('/', async (req, res, next) => {


	try {
		const foundUsers = await User.find({})
		res.json({
			status: 200,
			data: foundUsers,
			session: req.session
		})



	} catch (err) {
		res.status(400).json({
			status: 400,
			error: err
		})

	}
})

//show route
// shows a single user with the tasks, entertainment, podcasts, and news populated
// endpoint: /api/v1/user/{user id}
router.get('/:id', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.params.id).populate('tasks').populate('entertainment').populate('podcasts').populate('news')
		res.json({
			status: 200,
			data: foundUser,
			session: req.session
		})



	} catch (err) {
		res.status(400).json({
			status: 400,
			error: err
		})

	}
})

// update
// updates a user's username and/or email from their home page
// endpoint: /api/v1/user/{user id}/edit
router.put('/:id/edit', async(req, res, next) => {
	try {
		console.log(req.body);
		// const foundUser = await User.findById(req.params.id)
		if (req.body.password === '') {
			console.log('no password entered');
			const newReqBody = {username: req.body.username, email: req.body.email}
			const updatedUser = await User.findByIdAndUpdate(req.params.id, newReqBody, {new: true})
			console.log('this is updated user');
			console.log(updatedUser);
			res.json({
			status: 200,
			data: updatedUser,
			session: req.session
		})
		} else {
			const password = req.body.password;
			// the password has is what we want to put in the database

			const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			req.body.password = passwordHash
			console.log(req.body);
			const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
			res.json({
			status: 200,
			data: updatedUser,
			session: req.session
		})
		}
		
		



	} catch (err) {
		console.log(err);
		res.status(400).json({
			status: 400,
			error: err
		})

	}
})





// delete
// deletes a user
// endpoint: /api/v1/user/{user id}
router.delete('/:id', async (req, res, next) => {
	try {
		const deletedUser = await User.findByIdAndRemove(req.params.id)
		req.session.destroy()
		res.json({
			status: 200,
			data: deletedUser
		})



	} catch (err) {
		res.status(400).json({
			status: 400,
			error: err
		})

	}
})



module.exports = router;