let sports = [
  "Badminton",
  "Basketball",
  "Baseball",
  "Cricket",
  "Cycling",
  "Football",
  "Frisbee",
  "Golf",
  "Handball",
  "Running",
  "Soccer",
  "Squash",
  "Table Tennis",
  "Tennis",
  "Throwball",
];
for (let i = 0; i < sports.length; i++) {
  let option = document.createElement("option");
  option.value = sports[i];
  option.innerHTML = sports[i];
  document.getElementById("sports").appendChild(option);
}
let time = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
for (let i = 0; i < time.length; i++) {
  let option = document.createElement("option");
  option.value = time[i];
  option.innerHTML = time[i];
  document.getElementById("time").appendChild(option);
}

// var form = document.getElementById("create-form");

// if (form) {
//   form.addEventListener("submit", function (e) {
//     e.preventDefault();
//     console.log(e.target.elements);
//     location.href = "/venues/create";
//   });
// }

function validateForm() {
  const errorDiv = document.getElementById("error");
  const errList = document.getElementById("err-list");
  errorDiv.hidden = true;
  let venueName = document.forms["create-form"]["venueName"].value;
  let venueAddress = document.forms["create-form"]["venueAddress"].value;
  let venueImage = document.forms["create-form"]["venueImage"].value;
  let sports = document.forms["create-form"]["sports"].value;
  let price = parseInt(document.forms["create-form"]["price"].value);
  let venueTimings = document.forms["create-form"]["venueTimings"].value;
  let venueSlots = parseInt(document.forms["create-form"]["venueSlots"].value);
  let errors = [];
  if (venueName == "") {
    errors.push("Venue name is required");
  }
  if (venueAddress == "") {
    errors.push("Venue address is required");
  }
  if (venueImage == "") {
    errors.push("Venue image is required");
  }
  if (sports == "") {
    errors.push("Sports is required");
  }
  if (price == "" || price == 0 || price < 0) {
    errors.push("Price cannot be empty or less than 0");
  }
  if (venueTimings == "") {
    errors.push("Venue timings is required");
  }
  if (venueSlots == "" || venueSlots == 0 || venueSlots < 0) {
    errors.push("Venue slots cannot be empty or less than 0");
  }
  if (errors.length > 0) {
    errorDiv.hidden = false;
    errors.forEach((err) => {
      let li = document.createElement("li");
      li.innerHTML = err;
      errList.appendChild(li);
    });
    return false;
  }
}
