const fitlerForm = document.getElementById("filter-form");
const error = document.getElementById("error");
const errList = document.getElementById("err-list");

if (fitlerForm) {
  error.hidden = true;
  fitlerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let errorList = [];
    errList.innerHTML = "";
    console.log(e.target.elements[0].value);
    const search = e.target.elements[0].value;
    const min = parseInt(e.target.elements.min.value) || 0;
    const max = parseInt(e.target.elements.max.value) || 0;
    const rating = parseInt(e.target.elements.rating.value) || 0;
    console.log(min, max);
    if (min < 0) {
      errorList.push("Minimum price must be greater than 0");
    }
    if (max < 0) {
      errorList.push("Maximum price must be greater than 0");
    }
    if (max < min) {
      errorList.push("Maximum price must be greater than minimum price");
    }

    console.log(errList);

    if (errorList.length > 0) {
      error.hidden = false;
      errorList.forEach((err) => {
        let li = document.createElement("li");
        li.textContent = err;
        errList.appendChild(li);
      });
      return;
    }

    //console.log(location);
    location.href = `/venues?searchTerm=${search}&min=${min}&max=${max}&rating=${rating}`;
  });
}
