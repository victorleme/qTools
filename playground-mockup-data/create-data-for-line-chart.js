const moment = require("moment");
const fs = require("fs");
let data = new Array(300).fill({});
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let newData = data.map((element, i) => {
  let newObject = {
    date: moment("01/01/2019", "DD/MM/YYYY")
      .add(i, "days")
      .format("DD-MM-YYYY"),
    value: getRandomInt(200, 800),
  };
  return newObject;
});

console.log(newData);
fs.writeFileSync("./data.json", JSON.stringify(newData, null, 4));
