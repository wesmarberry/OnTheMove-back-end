## Models: 

### MVP

User {
	username  
	password  
	location {
		lat:
		lng:
}  	
	podcasts []  
	days []  
	entertainment_activities []  
	articles []  
}  

podcast {  
	image  
	audio  
	search_param  
	api_id  
	user_id  
	reviews []  
}  

days {  
	tasks []  
	date  
	user_id  
	past  
}  

task {  
	title  
	description  
	priority  
	completed  
	user_id  
}  

review {  
	desription  
	rating  
	user_id  
}  

### Nice To Have

entertainment_activity {  
	location {  
		lat:  
		lng:  
}  
	title  
	adress  
	date  
	search_param  
	user_id  
}  

### Stretch

article {  
	title  
	body  
	photo  
	search_param  
	review []  
}  

## Routes

### GET
* /users/{id} gets all single user information
* /users/logout destroys the session logs user out
* /podcasts gets all of a single users podcasts
* /podcasts/related makes API call to get podcasts realted to past user search params
* /podcasts/popular makes API call to get popular podcasts
* /podcasts/{id} shows single podcast
* /activity makes API call to show activities based on parameter
* /articles/related makes API call to show related articles
* /articles makes API call to show articles based on search params
* /articles/{id} shows single article for reading


### POST
* /users/register registers new users
* /users/login logs in existing users
* /podcasts creates new podcast and adds podcast to user podcast array
* /review creates review and add it to that podcast or activity array
* /currday creates new day with current date
* /futureday creates new day with future date
* /task creates new task and adds it to that day's array and saves user
* /activity creates new activity
* /article creates new article and adds the article to the users article array

### PUT
* /users edits user account information
* /task updates existing task

### DELETE
* /users deletes user account but does not delete reviews
* /activity deletes activity



























