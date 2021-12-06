const errDiv = document.getElementById("err");

errDiv.addEventListener("click", function () {
  console.log("errDiv clicked");
  errDiv.classList.remove("float-in");
  errDiv.classList.add("float-out");
  setTimeout(() => {
    errDiv.style.display = "none";
  }, 400);
});
