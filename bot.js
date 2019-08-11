const Twitter = require("twitter");
const axios = require('axios');
const cheerio = require('cheerio');
const ApiHandler = require('./apihandler.js');
var request = require('request');
var fs = require('fs');

const client = new Twitter({
  consumer_key:         process.env.BOT_CONSUMER_KEY,
  consumer_secret:      process.env.BOT_CONSUMER_SECRET,
  access_token_key:     process.env.BOT_ACCESS_TOKEN,
  access_token_secret:  process.env.BOT_ACCESS_TOKEN_SECRET
});

const TWEET_INTERVAL = 1000*5*60;
var today = new Date();
today.setDate(today.getDate());

var handler = new ApiHandler(today.getFullYear(), today.getMonth()+1, today.getDate());

handler.getHolidays().then(function(result) {
	result = result.filter(holiday => holiday.day.includes("Day"))
	for (var i = 0; i < result.length; i++) {
		let holiday = result[i].day.replace('\’', '');
		console.log(holiday)
		setTimeout(function(){postTweet(holiday)}, i*TWEET_INTERVAL);
	}
}, function(error) {
	console.log("Got Error with getHolidays()" + error);
});

function postTweet(holiday) {
	let tweetString = "Today is " + holiday + "! #" + holiday.replace(/\s/g, '');
	handler.getImages(holiday.replace("Day", '')).then(function(result) {
		let imgPath = './images/'+holiday.replace(/\s/g, '')+'.jpg';
		download(result[0].link, imgPath, result => {
			var imgData = fs.readFileSync(imgPath, { encoding: 'base64' })
 			client.post('media/upload', { media_data: imgData }, function (error, data, response) {
 			if (!error) {
  				var params = { status: tweetString, media_ids: data.media_id_string };
      			client.post('statuses/update', params, function (err, data, response) {
        			if(error) {
        				console.log(error);
        			}
      			})
      		} else {
      			console.log(error);
      		}
  		})
		});
	}, function(error) {
		console.log("Got Error with getImages()" + error)
	});
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);;
  });
};
