const fs = require('fs');
const path = require('path');
const RAW_FILE_PATH = path.resolve(__dirname, './raw.json');
const RESULT_ARR_FILE_PATH = path.resolve(__dirname, './pokedex_ko.list.json');
const RESULT_OBJ_FILE_PATH = path.resolve(__dirname, './pokedex_ko.json');

const fileData = fs.readFileSync(RAW_FILE_PATH);
const { raw: rawArray } = JSON.parse(fileData);
const pokedexObj = {};
const pokedexArr = [];

let includeNumber = false;
let includeName = false;
let tempNumber = 0;
let tempName = 0;
let currentNumber = 1;

const isPokeNumber = text => /#[0-9][0-9][0-9]/.test(text);

rawArray.forEach(text => {
  if (!text) {
    return;
  }

  if (isPokeNumber(text) && !includeNumber) {
    tempNumber = parseInt(text.slice(1));

    if (tempNumber === currentNumber) {
      includeNumber = true;
      currentNumber++;
    }
    return;
  }

  if (includeNumber && !includeName && !isPokeNumber(text)) {
    tempName = text;
    includeName = true;
    return;
  }

  if (includeNumber && includeName && !isPokeNumber(text)) {
    pokedexObj[tempName] = {
      idx: tempNumber,
      attr: text.split('\n')
    };

    includeName = false;
    includeNumber = false;

    pokedexArr.push(tempName);
  }
});

fs.writeFileSync(RESULT_OBJ_FILE_PATH, JSON.stringify({ data: pokedexObj }));
fs.writeFileSync(RESULT_ARR_FILE_PATH, JSON.stringify({ data: pokedexArr }));

console.log(`complete: ${pokedexArr.length} pokemon`);
