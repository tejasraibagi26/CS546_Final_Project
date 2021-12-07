const reportTypes = ["Abusive", "Hate", "Rude", "Sexual", "Other"];

const select = document.getElementById("reportType");
const reportDiv = document.getElementById("reportDiv");
const reportButton = document.getElementById("reportButton");
console.log(reportButton);
console.log(reportDiv);
if (reportDiv) {
  reportButton.addEventListener("click", () => {
    console.log("clicked");
    reportDiv.hidden = !reportDiv.hidden;
  });
}

if (select) {
  reportTypes.forEach((type) => {
    const option = document.createElement("option");
    option.text = type;
    option.value = type;
    select.appendChild(option);
  });
}

function validate() {
  const reportComment = document.forms["reportForm"]["reportComment"].value;
  const reportContentType =
    document.forms["reportForm"]["reportContentType"].value;
  if (reportComment == "") {
    alert("Please enter a comment");
    return false;
  }
  if (reportContentType == "") {
    alert("Please select a report type");
    return false;
  }

  return true;
}
