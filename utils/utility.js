const fs = require('fs');

// Utility functions

// Store data as a JSON object in a file
module.exports.saveData = (recData, recFile) => {
  // Convert recipe data into an array of JSON objects
  const recipeJSON = JSON.stringify(recData, null, 2);
  // Write the recipes to recFile
  fs.writeFileSync(recFile, recipeJSON);
};

// Reformat recipe title to capitalize first letter of words
module.exports.firstCap = (recTitle) => {
  let newTitle = '';
  const titleWords = recTitle.split(' ');

  titleWords.forEach(word => {
    const newWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    newTitle += `${newWord} `;
  });

  return newTitle;
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
