/* Global Variables */
const apikey = 'be9c6fa1618d541f572e624cbe1778cd';
const baseURL1 = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const baseURL2 = ',us&units=imperial&appid=';
// creating function to byuild url for obenweather map using  apikey and zipcode
const createOpenWeatherMapURL = ( zipCode ) => {

	return baseURL1 + zipCode + baseURL2 + apikey;

};

// creating function  get weather data from OpenWeatherMap API using zipcode
const getWeatherData  = async ( zipCode ) => {
// Create valid API URL
    const weatherURL = createOpenWeatherMapURL( zipCode ); 
    
 // Get weather info from OpenWeatherMap.org   
	const response = await fetch( weatherURL ); 

	try{
// Convert response to JSON and store it in const
        const weatherData = await response.json(); 
      // Store selected zip code 
		weatherData.zipCode = zipCode; 
		// creatinf condition fro case if zip code not found
		if( weatherData.cod == 404 ){

			return Promise.reject( weatherData.message );

		}

		return weatherData;

	}catch( error ){

		console.log( error );

	}

};

// creating function for posting app data to the server
const postAppData = async ( weatherData ) => {

	// Get user input
	const feelings = document.querySelector( '#feelings' ).value;

	// Create data for app entry
	const date = new Date();
	const fulldate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

	const appData = {
		'date': fulldate,
		'zipCode': weatherData.zipCode,
		'name': weatherData.name,
		'temp': weatherData.main.temp,
		'feelings': feelings
		};

	const response = await fetch( '/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( appData )
		});

	try{

		const returnData = await response.json();
		return returnData.entryID;

	}catch( error ){

		console.log( error );

	}

};

// Function for getting app data from the server
const getAppData = async () => {

	const response = await fetch( '/all' );

	try{
// Convert response to JSON and store
		const appData = await response.json(); 
		return appData;

	}catch( error ){

		console.log( error );

	}

};

// Update app UI with the app data
const updateUI = async ( appData ) => {

    let allEntries = ""
    

	for( const entry of appData.reverse() ){
        

		const result
 = `
		<div class="result">
			<div id="date">${entry.date}</div>
			<div id="city">${entry.name}</div>
			<div id="temp">${entry.temp}°F</div>
			<div id="feelings">${entry.feelings}</div>
		</div>
		`;

		allEntries += result;

	}
	// creating if codition to show message when there is no data in enetry holder
	if( allEntries != "" ){

		document.querySelector( '#entryHolder' ).innerHTML = allEntries;

	}else{
		document.querySelector( '#entryHolder' ).innerHTML = "No Data to Preview";
	}
};

// Main function used to add a input data to the app
const inputdata= () => {

	// Store user input
	const zipCode = document.querySelector( '#zip' ).value;
	const feelings = document.querySelector( '#feelings' ).value;

	// Simple form validation for zip code
	if( zipCode.length == 5 && !isNaN( zipCode ) ){

		// Simple form validation for feelings
		if( feelings.length > 0 ){

			// Get weather info, post data to server, and return entry from server
			getWeatherData( zipCode )
				.then( ( weatherData ) => { return postAppData( weatherData ); } )
				.then( () => { return getAppData(); } )
				.then( ( appData ) => { updateUI( appData );} )
				.catch( ( error ) => { alert( error ); } );

		}else{

			alert( "Please enter your feelings." );
			document.querySelector( '#feelings' ).focus();

		}
	
	}else{

		alert( 'Please enter a valid 5 digit zip code.' );
		document.querySelector( '#zip' ).focus();

	}

};

// Add event listeners when the page is ready
document.addEventListener( 'DOMContentLoaded', () => {

	// Add functionality to 'Generate' button via click event listener
	document.querySelector( '#generate' ).addEventListener( 'click', inputdata);

	// Load existing journal entries
	getAppData()
		.then( ( appData ) => { updateUI( appData ); } );

});