const createCommentForm = document.getElementById("createCommentForm");
  
  if (createCommentForm) {
    const commentText = document.getElementById("commentText");
    const rating = document.getElementById("commentRating");
    const error = document.getElementById("createCommentError");
  
    createCommentForm.addEventListener("submit", (event) => {
      let commentTextValue = commentText.value;
      error.hidden = true;
  
      try {
        if (!commentTextValue) throw "Must provide Comment Content";
        if (commentTextValue.trim().length == 0) throw "Must provide Comment Content";
      } catch (e) {
        commentText.value = "";
        error.innerHTML = e;
        error.hidden = false;
        commentText.focus();
        event.preventDefault();
        return;
      }
  
    });
  }
