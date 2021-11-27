//! NOT IN USE //
const form = document.getElementById("cost");
const minValue = document.getElementById("min");
const maxValue = document.getElementById("max");
console.log(minValue, maxValue);
let min;
let max;
minValue.addEventListener("change", function (e) {
  console.log(e.target.val);
  min = e.target.value;
});

maxValue.addEventListener("change", function (e) {
  max = e.target.value;
});

console.log(min, max);
