(function ($) {
  let showActive = $("#showActiveGamesParts"),
    showPast = $("#showPastGamesParts"),
    activeParts = $(".activeParts"),
    pastParts = $(".pastParts"),
    editBioForm = $("#editBio"),
    biography = $("#enterBiography"),
    editBio = $("#editBioLink");
  error = $("#errorBio");

  $(document).ready(function () {
    activeParts.hide();
    pastParts.hide();
    editBioForm.hide();
  });

  $(editBio).click(function (event) {
    editBioForm.show();
    editBio.hide();
  });

  $(showActive).click(function (event) {
    if (activeParts.is(":visible")) {
      activeParts.hide();
      showActive.html("Show Participants");
    } else {
      activeParts.show();
      showActive.html("Hide Participants");
    }
  });

  $(showPast).click(function (event) {
    if (pastParts.is(":visible")) {
      pastParts.hide();
      showPast.html("Show Participants");
    } else {
      pastParts.show();
      showPast.html("Hide Participants");
    }
  });

  $(editBioForm).submit(function (event) {
    let bio = biography.val();
    console.log(bio);

    try {
      if (!bio) throw "Must provide a biography";
      if (bio.trim().length == 0) throw "Must provide a biography";
    } catch (e) {
      biography.val("");
      error.text(e);
      error.show();
      biography.focus();
      event.preventDefault();
      return;
    }
  });
})(window.jQuery);
