(function ($) {
  let loginForm = $("#loginForm"),
    email = $("#loginEmail"),
    password = $("#loginPassword"),
    error = $("#loginError");

  loginForm.submit(function (event) {
    let emailValue = email.val();
    let passwordValue = password.val();
    error.val("");
    error.hide();

    try {
      if (!emailValue) throw "Must provide email";
      if (emailValue.trim().length == 0) throw "Must provide email";
      let atsign = emailValue.indexOf("@");
      if (atsign == -1) throw "Must provide valid email";
      if (atsign == 0) throw "Must provide valid email";
      let domain = emailValue.substring(atsign + 1, emailValue.length);
      if (domain.length == 0) throw "Must provide valid email";
      let dotsign = domain.indexOf(".");
      if (dotsign == -1) throw "Must provide valid email";
      if (dotsign == 0) throw "Must provide valid email";
      if (domain.substring(dotsign + 1, domain.length).length == 0)
        throw "Must provide valid email";
    } catch (e) {
      email.val("");
      password.val("");
      error.text(e);
      error.show();
      email.focus();
      event.preventDefault();
      return;
    }

    try {
      if (!passwordValue) throw "Must provide password";
      if (passwordValue.trim().length == 0) throw "Must provide password";
    } catch (e) {
      password.val("");
      error.text(e);
      error.show();
      password.focus();
      event.preventDefault();
      return;
    }
  });
})(window.jQuery);
