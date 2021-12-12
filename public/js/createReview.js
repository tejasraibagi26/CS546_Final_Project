const createReviewForm = document.getElementById("createReviewForm");
  
  if (createReviewForm) {
    const reviewText = document.getElementById("reviewText");
    const rating = document.getElementById("reviewRating");
    const error = document.getElementById("createReviewError");
  
    createReviewForm.addEventListener("submit", (event) => {
      let reviewTextValue = reviewText.value;
      let ratingValue = rating.value;
      error.hidden = true;
  
      try {
        if (!reviewTextValue) throw "Must provide Review Content";
        if (reviewTextValue.trim().length == 0) throw "Must provide Review Content";
      } catch (e) {
        reviewText.value = "";
        error.innerHTML = e;
        error.hidden = false;
        reviewText.focus();
        event.preventDefault();
        return;
      }
  
    });
  }
