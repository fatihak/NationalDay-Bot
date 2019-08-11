const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

class ApiHandler{

	constructor(day, month, year) {
		this.date = new Date(day, month, year);
		console.log(this.date.getFullYear(),this.date.getMonth(),this.date.getDate())
	}

	getHolidays(){
		const d = this.date;
		const scraper = this.scraper;
		const zeroPad = this.zeroPad;
		return new Promise(function(resolve, reject) {
  			axios.get(`https://www.daysoftheyear.com/days/${d.getFullYear()}/${zeroPad(d.getMonth())}/${zeroPad(d.getDate())}`)
  			.then(response => {
				resolve(scraper(response.data));
				})
			.catch(error => {
				reject(error);
				})
			});
	}

	getImages(searchQuery) {
		return new Promise(function(resolve, reject) {
  			axios.get(`https://www.googleapis.com/customsearch/v1?`+
  				`key=`+ process.env.BOT_GOOGLE_API_KEY +
  				`&cx=007533542712610196124:8yk-ubuz0vs`+
  				`&q=${searchQuery}`+
  				`&num=5`+
  				`&searchType=image`+
  				`&imgSize=xxlarge`+
  				'&imgType=photo')
  			.then(response => {
				resolve(response.data.items);
				})
			.catch(error => {
				reject(error)
				})
			});
	}

	scraper(html) {
		const data = [];
		const $ = cheerio.load(html);
		$('.card-title').each((i, elem) => {
			data.push({day: $(elem).text()});
		});
		return data;
	}



	zeroPad(num) {
		return num >= 10 ? num : "0" + num;
	}


}

module.exports = ApiHandler;
