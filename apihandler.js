const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

class ApiHandler{

	constructor(today) {
		this.date = today;
		this.HOLIDAY_URL = 'https://www.daysoftheyear.com';
		this.GOOGLE_SEARCH_URL = 'https://www.googleapis.com';
	}

	// Get holidays for today
	getHolidays(){
		const url = `${this.HOLIDAY_URL}/days/${this.date.getFullYear()}/${this.zeroPad(this.date.getMonth())}/${this.zeroPad(this.date.getDate())}`;
		const scraper = this.holidayScraper;
		return new Promise(function(resolve, reject) {
  			axios.get(url)
  			.then(response => { resolve(scraper(response.data)); })
			.catch(error => { reject(error); })
			});
	}

	// Gets image link from Google Custom Search result for searchQuery
	getImage(searchQuery) {
		const url = `${this.GOOGLE_SEARCH_URL}/customsearch/v1?`+
  				`key=`+ process.env.BOT_GOOGLE_API_KEY +
  				`&cx=007533542712610196124:8yk-ubuz0vs`+
  				`&q=${searchQuery}`+
  				`&num=5`+
  				`&searchType=image`+
  				`&imgSize=xxlarge`+
  				'&imgType=photo'
		return new Promise(function(resolve, reject) {
  			axios.get(url)
  			.then(response => { resolve(response.data.items[0].link);})
			.catch(error => { reject(error) })
			});
	}

	// Scrapes input html for holidays
	holidayScraper(html) {
		const data = [];
		const $ = cheerio.load(html);
		$('.card-title').each((i, elem) => {
			data.push( $(elem).text() );
		});
		return data;
	}

	zeroPad(num) {
		return num >= 10 ? num : "0" + num;
	}


}

module.exports = ApiHandler;
