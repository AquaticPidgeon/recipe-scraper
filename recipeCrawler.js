const async = require('async');
const { scrapeCooks } = require('./scrapers/scrapeCooks.js');
const { scrapeSeriousEats } = require('./scrapers/scrapeSerEats.js');
const { scrape100Days } = require('./scrapers/scrape100Days.js');
const { combineRecipes } = require('./utils/utility.js');

module.exports.recipeCrawler = () => {
  const recipeScrapers = [scrapeCooks, scrapeSeriousEats, scrape100Days];
  const funcs = recipeScrapers.concat(combineRecipes);
  async.series(funcs);
};
