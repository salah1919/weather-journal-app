// Setup empty JS array to act as endpoint for all routes
const projectData = []; 
//set Port to listen 
const port = 8000;
// Include Node.js modules 
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const cors = require( 'cors' );

// Initialize instance of the server using Express
const app = express();


// Specify app directory
app.use( express.static('website') ); 
//Here we are configuring express to use body-parser as middle-ware.
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json());
 // using Cors for cross origin allowance

app.use( cors() ); 
// Setup Server

app.listen(port, () => {
    console.log(`Server Running On: http://localhost:${port}`);
});
// Add POST route
app.post( '/upload', postData );

// Function that handles POST requests
function postData( request, response ){

	projectData.push( request.body );
	response.send( request.body );
}
// Add GET route
app.get( '/all', getData );

// Function that handles GET requests
function getData( request, response ){
	response.send( projectData );

}