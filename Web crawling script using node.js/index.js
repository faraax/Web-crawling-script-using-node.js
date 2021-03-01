const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require('json2csv').Parser;

const movies = ["https://www.imdb.com/title/tt0242519/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt0419058/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt0995031/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt0806088/?ref_=tt_sims_tt",
    "https://www.imdb.com/title/tt1146325/?ref_=tt_sims_tt"
];

(async () => {
    let data = [];
    for (let movie of movies) {
        const resonse = await request({
            uri: movie,
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip: true
        });
       
        let $ = cheerio.load(resonse);
        
        let Title = $('div[class="title_wrapper"] > h1').text().trim();

        let Rating = $('div[class="ratingValue"] > strong > span').text();

        let Summary = $('div[class="summary_text"]').text().trim();

        let ReleaseDates = $('a[title="See more release dates"]').text().trim()

        data.push({
            Title,
            Rating,
            Summary,
            ReleaseDates
        });
    }
    const j2cp = new json2csv();
    const csv = j2cp.parse(data);
    fs.appendFileSync('./CSV/data.csv', csv);
}
)();

