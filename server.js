const express = require('express');
const rc = require('./recipeCrawler.js');

// Establish express server
const server = express();

// Set up server routes
server.get('/', (req, res) => {
  res.sendFile(`${__dirname}/data/combinedRecipes.JSON`);
});

server.get('/refresh', (req, res) => {
  res.send('Crawling for recipes...');
  rc.recipeCrawler();
});

// Initialize listener
server.listen(8080, () => {
  console.log('Now serving up recipe data on port 8080');
});

