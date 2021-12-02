function validate() {
  const error = document.getElementById("error");
  const ul = document.getElementById("err-list");
  let errors = [];
  let startTime = document.forms["book-form"]["startTime"].value;
  let endTime = document.forms["book-form"]["endTime"].value;
  let date = document.forms["book-form"]["date"].value;

  let currentDate = new Date().toLocaleDateString();
  date = date.split("-").reverse().join("/");
  currentDate = currentDate.split("/");
  let newCurrentDate =
    currentDate[1] + "/" + currentDate[0] + "/" + currentDate[2];

  if (date == null) {
    errors.push("Please select a date");
  }

  if (date !== newCurrentDate) {
    errors.push("Please select a future date");
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

  return false;
  //location.href = "/bookings/create";
}
