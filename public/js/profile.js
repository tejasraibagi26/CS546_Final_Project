(function ($) {
  let showActive = $("#showActiveGamesParts"),
    showPast = $("#showPastGamesParts"),
    activeParts = $(".activeParts"),
    pastParts = $(".pastParts");

  $(document).ready(function () {
    activeParts.hide();
    pastParts.hide();
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
})(window.jQuery);
