const express = require('express');
const rc = require('./recipeCrawler.js');

// Establish express server
const server = express();
const port = 8080;

// Set up server routes
server.get('/', (req, res) => {
  res.sendFile(`${__dirname}/data/combinedRecipes.JSON`);
});

server.get('/refresh', (req, res) => {
  res.send('Crawling for recipes...');
  rc.recipeCrawler();
});

// Initialize listener
server.listen(port, () => {
  console.log(`Now serving up recipe data on port ${port}`);
});

