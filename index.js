const axios = require('axios');
const cheerio = require('cheerio');
const assert = require('assert');
const fs = require('fs');

(async () => {
	const res = await axios({
		method: 'get',
		url: 'http://sp.pf.mbga.jp/12008305/',
		params: {
			url: 'http://125.6.169.35/idolmaster/cartoon/index',
		},
		headers: {
			Cookie: `sp_mbga_sid_12008305=${process.env.SESSION_ID}`,
			'User-Agent': 'Mozilla/5.0 (iPad)',
		},
		responseType: 'text',
	});

	assert.strictEqual(res.status, 200);
	assert(res.headers['content-type'].startsWith('text/html'))

	const $ = cheerio.load(res.data);

	const $theaters = $('.theater-thumbnail_list > .theater-thumbnail')
	const theaters = $theaters.map((i, theater) => {
		const $theater = $(theater);
		const storyNum = $theater.find('.theater-story_num').text();
		const thumbnailUrl = $theater.children('img').attr('src');
		const updateDate = $theater.find('.theater-update_date').text();
		return {storyNum, thumbnailUrl, updateDate};
	}).get();

	console.log(theaters);
})();
