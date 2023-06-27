const cheerio = require('cheerio');
const baseUrl = 'https://csgoskins.gg/items/';
const listingsSelector = 'body > main > div > div.w-full.sm\\:w-full.md\\:w-full.lg\\:w-3\\/5.xl\\:w-2\\/3.\\32 xl\\:w-2\\/3.p-4.flex-none';
const linkSelector = 'div.w-full.sm\\:w-1\\/4.p-4.flex-none.text-center.sm\\:text-right > a';
const marketSelector = 'div:nth-child(1) > div.w-full.whitespace-nowrap > a';

async function findListing(name) {
    const response = await fetch(baseUrl + name, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    let listing = null;
    let lowestPrice = Infinity;

    $(listingsSelector).children().each((i, el) => {
        const priceText = $(el).find('div:nth-child(3) > div:nth-child(2) > span').text();
        const priceNum = parseFloat(priceText.replace('$', ''));
        if (priceNum < lowestPrice) {
            lowestPrice = priceNum;
            listing = el;
        }
    });

    if (listing == null) {
        return null;
    }

    const market = $(listing).find(marketSelector).text().trim();
    const link = $(listing).find(linkSelector).attr('href');
    return { market, lowestPrice, link };
}

async function main() {
    const { market, lowestPrice, link } = await findListing('revolution-case');
    console.log(`Market: ${market}, Price: ${lowestPrice}`);
}

main();