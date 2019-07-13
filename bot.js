
const Twit = require("twit");
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const ApiHandler = require('./apihandler.js');

var T = new Twit({
  consumer_key:         process.env.BOT_CONSUMER_KEY,
  consumer_secret:      process.env.BOT_CONSUMER_SECRET,
  access_token:         process.env.BOT_ACCESS_TOKEN,
  access_token_secret:  process.env.BOT_ACCESS_TOKEN_SECRET
});


var TWEET_INTERVAL = 1000;
var today = new Date();
var handler = new ApiHandler(today.getFullYear(), today.getMonth()+1, today.getDate());

handler.getHolidays().then(function(result) {
	result = result.filter(holiday => holiday.day.includes("Day"))
	for (var i = 0; i < result.length; i++) {
		holiday = result[i].day
		scheduleTweet("Today is" + holiday + "! #" + holiday.replace(/\s/g, ''), i*TWEET_INTERVAL);

	}
}, function(error) {
	console.log(error);
});


function scheduleTweet(tweet, time) {
	setTimeout(function(){
		T.post('statuses/update', { status: tweet }, function(err, data, response) {
  			console.log(response);
		});
	}, time);
}
