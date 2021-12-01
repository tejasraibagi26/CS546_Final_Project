function validate() {
  const error = document.getElementById("error");
  const ul = document.getElementById("err-list");
  error.hidden = true;
  var title = document.forms["create-post"]["activityTitle"].value;
  console.log(title);
  var body = document.forms["create-post"]["activityBody"].value;
  var playersReq = parseInt(document.forms["create-post"]["playerReq"].value);

  let errors = [];
  if (title == null || title == "") {
    errors.push("Title is required");
  }
  if (body == null || body == "") {
    errors.push("Body is required");
  }
  if (playersReq == null) {
    errors.push("Players Required is required");
  }
  if (playersReq < 0 || playersReq > 100 || playersReq === 0) {
    errors.push("Players Required must be between 1 and 100");
  }

  if (errors.length > 0) {
    error.hidden = false;
    errors.forEach((error) => {
      let li = document.createElement("li");
      li.innerHTML = error;
      ul.appendChild(li);
    });
    return false;
  }
}
