const cost = document.getElementById("cost");
const startTime = document.forms["book-form"]["startTime"];
const endTime = document.forms["book-form"]["endTime"];
const price = document.getElementById("price");
const costVal = document.getElementById("costVal");

//Get the start time
let sT = startTime.value.split(":")[0];
//Get the end time
let eT = endTime.value.split(":")[0];
let total = 0;

//Event listener to listen for changes in the start time
startTime.addEventListener("change", (e) => {
  //Get the new start time
  sT = e.target.value.split(":")[0];
  //Update the cost based on the new start time
  updateCost();
});

//Event listener to listen for changes in the end time
endTime.addEventListener("change", (e) => {
  //Get the new end time
  eT = e.target.value.split(":")[0];
  //Update the cost based on the new end time
  updateCost();
});

function updateCost() {
  //Subtrack the start time from the end time and multiply by the price
  total = (eT - sT) * price.value;

  if (total > 0) {
    //Display the cost
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
