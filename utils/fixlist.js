const fs = require('fs');
const _ = require('lodash');

let foodList = fs.readFileSync('../data/foodList.txt', 'utf8');

foodList = foodList.split('\n');
foodList = _.uniq(foodList)
              .sort()
              .join('\n')
              .toLowerCase();

console.log(foodList);

fs.writeFileSync('../data/foodList.txt', foodList);
