const fs = require('fs');

// Utility functions

// Store data as a JSON object in a file
exports.saveData = (recData, recFile) => {
  // Convert recipe data into an array of JSON objects
  const recipeJSON = JSON.stringify(recData, null, 2);
  // Write the recipes to recFile
  fs.writeFileSync(recFile, recipeJSON);
};

// Combine recipe files
module.exports.combineRecipes = (callback) => {
  const recipeFileList = ['./data/recipesSE.JSON',
    './data/recipesCooks.JSON',
    './data/recipes100days.JSON'];
  const combinedFile = './data/combinedRecipes.JSON';
  let combinedList = [];

  // Read each recipe file and add it to recipeList array
  recipeFileList.forEach(file => {
    const recipeList = JSON.parse(fs.readFileSync(file, 'utf8'));
    combinedList = combinedList.concat(recipeList);
  });
  // Convert combinedList to a JSON array and save it to combinedFile
  combinedList = JSON.stringify(combinedList, null, 2);
  fs.writeFileSync(combinedFile, combinedList);
  console.log('Recipe files combined!');
  callback(null);
};
