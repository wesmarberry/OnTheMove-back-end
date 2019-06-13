# OnThMove Back End

Decoupled back end server for onThMove front end: https://github.com/wesmarberry/OnThMove

Deployed Front End: https://onthmove.herokuapp.com/


## Technologies
* NodeJS
* Express
* MongoDB
* Mongoose

## Models: 

User {  
	email: {type: String, required: true},  
	username: {type: String, required: true},  
	password: {type: String, required: true},  
	lat: Number,  
	lng: Number,  
	tasks:[{  
		type: mongoose.Schema.Types.ObjectId,  
		ref: 'Task'  
	}],  
	entertainment:[{  
		type: mongoose.Schema.Types.ObjectId,    
		ref: 'Entertainment'  
	}],  
	podcasts:[{.  
		type: mongoose.Schema.Types.ObjectId,  
		ref: 'Podcast'  
	}],  
	news:[{  
		type: mongoose.Schema.Types.ObjectId,  
		ref: 'News'  
	}],  
	searches: Array,  
	friends: Array,  
	podcastIds: Array  
}  

podcast {  
	name: {type: String, required: true},  
	description: {type: String, required: true},  
	image: String,  
	episodes: Array,  
	reviews:[{  
		type: mongoose.Schema.Types.ObjectId,  
		ref: 'Review'  
	}],  
	userId: String,  
	apiId: String  
}  

task {  
	title: String,  
	description: {type: String, required:   true},  
	priority: String,  
	completed: {type: String, default: 'false'},  
	time: String,  
	date: String,  
	userId: String  
}  

review {  
	body: String,  
	rating: String,  
	username: String,  
	userId: String,  
	activityId: String,  
	activityApiId: String  
}  


Entertainment {  
	name: {type: String, required: true},  
	formatted_address: String,  
	lat: Number,  
	lng: Number,  
	reviews:[{. 
		type: mongoose.Schema.Types.ObjectId,  
		ref: 'Review'. 
	}],  
	date: String,  
	userId: String,  
	apiId: String  
}  

News {  
	content: String,  
	description: String,  
	author: String,  
	title: String,  
	publishedDate: String,  
	image: String,  
	userId: String,  
	url: String  
}  

## Endpoints

### GET
* /api/v1/user/logout - logs out users
* /api/v1/user - finds all users
* /api/v1/user/{user id} - shows a single user with the tasks, entertainment, podcasts, and news populated
* /api/v1/podcast/popular - finds popular podcasts
* /api/v1/podcast/find/{search parameter}/{user Id} - searches for podcasts
* /api/v1/podcast/{podcast id}/{user id}/create - creates new podcast
* /api/v1/podcast/recommended/{user id} - finds recommended podcasts for a user
* /api/v1/{podcast id} - shows a single podcast
* /api/v1/news/top - finds top news headlines
* /api/v1/news/{user Id}/recommended - finds 5 recommended news headlines
* /api/v1/news/{search parameter}/{user Id}/search - searches for news articles based on keyword
* /api/v1/news/{news id} - shows a single news article

### POST
* /api/v1/user/register - registers new users
** req.body requirements: lat, lng, email, username, password
* /api/v1/user/new - logs in existing users
** req.body requirements: username, password, lat, lng
/api/v1/entertainment/find - searches for activities 
** req.body requirements: userId, search
* /api/v1/entertainment/related - finds related entertainment
** req.body requirements: userId
* /api/v1/entertainment/add - creates an activity
** req.body requirements: name, lat, lng, date, userId, apiId, formatted_address
* /api/v1/entertainment/custom - creates custom entertainment activity
** req.body requirements: userId, customEnt (search), date
* /api/v1/task - creates new task 
** req.body reqirements: description, priority, time, userId, date
* /api/v1/news/add - creates news
** req.body requirements: content, description, author, publishedDate, userId, image, title, url

### PUT
* /api/v1/user/{user id}/edit - updates a user's username and/or email from their home page
* /api/v1/task/{task id}/edit - updates a task
* /api/v1/task/updateall - updates all tasks that have not been marked as completed and were created before the current date

### DELETE
* /api/v1/user/{user id} - deletes a user
* /api/v1/entertainment/{entertainment Id} - deletes entertainment activity
* api/v1/task/{task id} - deletes a task
* /api/v1/{podcast id} - deletes a podcast
* api/v1/news/{article Id} - deletes news




























