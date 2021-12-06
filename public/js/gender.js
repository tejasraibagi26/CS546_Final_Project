//Dynamically creating gender options
const typeOfGenders = [
  "Male",
  "Female",
  "Binary",
  "Non Binary",
  "Trans",
  "Gay",
  "Bisexual",
  "Prefer not to respond",
];

const select = document.getElementById("gender");

typeOfGenders.forEach((gender) => {
  let option = document.createElement("option");
  option.value = gender;
  option.innerText = gender;
  select.appendChild(option);
});
