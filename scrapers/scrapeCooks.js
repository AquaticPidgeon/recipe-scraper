const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const { saveData } = require('../utils/utility.js');

// Recipe Data output file
const recipeFile = './data/recipesCooks.JSON';

// URL to scrape from:
const scrapeUrl = 'http://www.cooks.com/rec/browse/';

// data variables
const recipeData = [];
let urls = [];

// Get food list from file
let foodList = fs.readFileSync('./data/foodList.txt', 'utf8');
foodList = foodList.split('\n');

module.exports.scrapeCooks = (callback) => {
  // options for request-promise
  const opts = {
    uri: scrapeUrl,
    // use cheerio (subset of jQuery for the server) to read the DOM
    transform: (body) => cheerio.load(body),
  };

  // Get html from scrapeUrl using request-promise to make an http request
  rp(opts)
    .then(($) => {
      console.log('Scraping Cooks.com for recipe data, please wait...');

      // get URLs from the page
      $('a').each((i, value) => {
        const $a = $(value);
        const url = ($a.attr('href'));
        urls.push(`http://www.cooks.com${url}`);
      });
      // remove duplicates and filter out non-recipes
      urls = _.uniq(urls)
              .filter(val => val.search('http://www.cooks.com/recipe') !== -1);

      // Crawling through subpages
      let urlCounter = 0;

      urls.forEach(url => {
        const options = {
          uri: url,
          transform: (body) => cheerio.load(body),
        };

        // Request data from subpages
        rp(options)
          .then(($page) => {
            // read subpage DOM and scrape data
            const title = $page('.title').text();
            const imgUrl = $page('img.photo').attr('src') ||
             'http://mukut.se/default_food_menu_foto/default_food_image.jpeg';
            const ingredients = [];

            // get ingredient data
            $page('.ingredient').each((i, value) => {
              const ingredient = $page(value).text().toLowerCase();
              // check ingredient against each item in foodList
              foodList.forEach(food => {
                const foodRegEx = new RegExp(`\\b${food}\\b`);
                if (ingredient.search(foodRegEx) !== -1 &&
                  food.length > 1 &&
                  ingredients.indexOf(food) === -1) {
                  ingredients.push(food);
                }
              });
            });

            // add data to recipeData object
            recipeData.push({ title, url, imgUrl, ingredients });

            console.log(`Now scraping recipe: ${title}`);

            // keep track of how many URLs we have iterated over
            urlCounter++;
            // when we have ingredients from all URLs
            if (urlCounter === urls.length) {
              // save recipeData to file as a JSON array object
              saveData(recipeData, recipeFile);
              console.log('Scraping Cooks.com complete!');
              callback(null);
            }
          });
      });
    });
};

// scrapeCooks();

