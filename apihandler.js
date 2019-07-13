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
  				console.log("Got Response");
				resolve(scraper(response.data));
				})
			.catch(error => {
				console.log("Got Error");
				reject(error);
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
		return num > 10 ? num : "0" + num;
	}


}

module.exports = ApiHandler;
