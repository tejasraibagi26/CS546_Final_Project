const errDiv = document.getElementById("err");

if (errDiv) {
  errDiv.addEventListener("click", function () {
    errDiv.classList.remove("float-in");
    errDiv.classList.add("float-out");
    setTimeout(() => {
      errDiv.style.display = "none";
    }, 400);
  });
}
