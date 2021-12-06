const cost = document.getElementById("cost");
const startTime = document.forms["book-form"]["startTime"];
const endTime = document.forms["book-form"]["endTime"];
const price = document.getElementById("price");
const costVal = document.getElementById("costVal");

let sT = startTime.value.split(":")[0];
let eT = endTime.value.split(":")[0];
let total = 0;

startTime.addEventListener("change", (e) => {
  sT = e.target.value.split(":")[0];
  updateCost();
});

endTime.addEventListener("change", (e) => {
  eT = e.target.value.split(":")[0];
  updateCost();
});

function updateCost() {
  total = (eT - sT) * price.value;
  console.log(total);
  if (total > 0) {
    cost.innerText = `Total cost: $${total}.00`;
    costVal.value = total;
  }
}

function validate() {
  const error = document.getElementById("error");
  const ul = document.getElementById("err-list");

  let errors = [];
  let startTime = document.forms["book-form"]["startTime"].value;
  let endTime = document.forms["book-form"]["endTime"].value;
  let date = document.forms["book-form"]["date"].value;

  let currentDate = new Date().toLocaleDateString();

  if (date == null || date == "") {
    errors.push("Please select a date");
  }

  if (Date.parse(date) - Date.parse(currentDate) < 0) {
    errors.push("Please select a date in the future");
  }

  if (startTime == endTime) {
    errors.push("Start and end time cannot be the same");
  }

  if (startTime > endTime) {
    errors.push("Start time cannot be after end time");
  }

  if (errors.length > 0) {
    error.hidden = false;
    ul.innerHTML = "";
    errors.forEach((error) => {
      const li = document.createElement("li");
      li.innerText = error;
      ul.appendChild(li);
    });

    return false;
  }

  return true;
}
