const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const { saveData } = require('../utils/utility.js');

// Recipe Data output file
const recipeFile = './data/recipesSE.JSON';

// URL to scrape from:
const scrapeUrl = 'http://www.seriouseats.com/recipes';

// data variables
let recipeData = [];
const urls = [];

// Get food list from file
let foodList = fs.readFileSync('./data/foodList.txt', 'utf8');
foodList = foodList.split('\n');

module.exports.scrapeSeriousEats = (callback) => {
  // options for request-promise
  const opts = {
    uri: scrapeUrl,
    // use cheerio (subset of jQuery for the server) to read the DOM
    transform: (body) => cheerio.load(body),
  };

  // Get html from scrapeUrl using request-promise to make an http request
  rp(opts)
    .then(($) => {
      console.log('Scraping Serious Eats for recipe data, please wait...');

      // get recipe data
      $('.module-wrapper').each((i, value) => {
        const $module = $(value);
        // scrape data from the DOM
        const title = $module.find('.title a').text();
        const url = $module.find('.title a').attr('href');
        const imgUrl = $module.find('figure a img').attr('data-src');

        // store data in recipeData object and create storage for ingredients
        recipeData.push({ title, url, imgUrl, ingredients: [] });
      });
      // remove duplicates and filter out non-recipes
      recipeData = _.uniqBy(recipeData, val => val.title).filter(val =>
        val.url.search('http://www.seriouseats.com/recipes') !== -1
      );

      // add all urls to urls for iterating
      recipeData.forEach(val => {
        urls.push(val.url);
      });

      // Crawling through subpages
      let urlCounter = 0;

      urls.forEach((url, index) => {
        const options = {
          uri: url,
          transform: (body) => cheerio.load(body),
        };

        // Request data from subpages
        rp(options)
          .then(($page) => {
            // read subpage DOM
            const ingredients = [];

            // get ingredient data
            $page('li.ingredient').each((i, value) => {
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

            // add ingredients to recipeData object
            recipeData[index].ingredients = ingredients;

            console.log(`Now scraping recipe: ${recipeData[index].title}`);

            // keep track of how many URLs we have iterated over
            urlCounter++;
            // when we have ingredients from all URLs
            if (urlCounter === urls.length) {
              // save recipeData to file as a JSON array object
              saveData(recipeData, recipeFile);
              console.log('Scraping Serious Eats complete!');
              callback(null);
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
