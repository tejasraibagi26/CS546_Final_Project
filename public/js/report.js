const reportTypes = ["Abusive", "Hate", "Rude", "Sexual", "Other"];

const select = document.getElementsByClassName("reportType");
const reportDiv = document.getElementsByClassName("reportDiv");
const reportButton = document.getElementsByClassName("reportButton");

if (reportDiv) {
  for (let i = 0; i < reportButton.length; i++) {
    reportButton[i].addEventListener("click", () => {
      reportDiv[i].hidden = !reportDiv[i].hidden;
    });
  }
}

if (select) {
  for (let i = 0; i < select.length; i++) {
    reportTypes.forEach((type) => {
      const option = document.createElement("option");
      option.text = type;
      option.value = type;
      select[i].appendChild(option);
    });
  }
}

function validateReport() {
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
