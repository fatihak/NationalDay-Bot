var Twit = require(‘twit’);

var T = new Twit({
  consumer_key:         process.env.BOT_CONSUMER_KEY,
  consumer_secret:      process.env.BOT_CONSUMER_SECRET,
  access_token:         process.env.BOT_ACCESS_TOKEN,
  access_token_secret:  process.env.BOT_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
var phrase = "Hello, World! This is my first tweet. I am a bot that will tweet about National Days! #firstTweet"
T.post('statuses/update', { status: phrase }, function(err, data, response) {
  console.log(data)
})