const Twitter = require("twitter");
const ApiHandler = require('./apihandler.js');
var request = require('request');
var fs = require('fs');

// Set up Twitter credentials
const twitterClient = new Twitter({
  consumer_key:         process.env.BOT_CONSUMER_KEY,
  consumer_secret:      process.env.BOT_CONSUMER_SECRET,
  access_token_key:     process.env.BOT_ACCESS_TOKEN,
  access_token_secret:  process.env.BOT_ACCESS_TOKEN_SECRET
});

// Tweet interval set to 1 hour
const TWEET_INTERVAL = 1000*60*60;

// Initialize ApiHandler
var today = new Date();
var apiHandler = new ApiHandler(today);

apiHandler.getHolidays().then(function(result) {

  // Filter retrieved holidays to those that contain "Day"
	result = result.filter(holiday => holiday.includes("Day"));

  // Schedule a holiday tweet at every hour
	for (var i = 0; i < result.length; i++) {
    const holiday = result[i];
		setTimeout(function(){postTweet(holiday)}, i*TWEET_INTERVAL);
	}

}, function(error) {
	console.log(error);
});

// Post holiday tweet with its related image
function postTweet(holiday) { 
  // Get image for holiday
  holiday = holiday.trim();
	apiHandler.getImage(encodeURIComponent(holiday.replace("Day", ''))).then(result => {

		const imgPath = './images/'+holiday.replace(/\s/g, '')+'.jpg';

    // Download image to imgPath 
		download(result, imgPath, result => {
			const imgData = fs.readFileSync(imgPath, { encoding: 'base64' })

      // Upload image to twitter
 			twitterClient.post('media/upload', { media_data: imgData })
        .then(data => {
          const params = { status: getTweetString(holiday), media_ids: data.media_id_string };

          // Post tweet with status and uploaded image
          twitterClient.post('statuses/update', params)
          .then(tweet => console.log("Tweet posted for " + holiday + "!") )
          .catch(error => console.log(error) );

        })
        .catch(error => console.log(error) );
		});
	})
  .catch( error => console.log(error) );
}

// Create the tweet content with hashtag
function getTweetString(holiday){
  return "Today is " + holiday + "! #" + holiday.replace(/\s/g, '');
}

// Download image from uri to filename
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);;
  });
};

