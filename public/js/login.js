(function ($) {
  let loginForm = $("#loginForm"),
    email = $("#loginEmail"),
    password = $("#loginPassword"),
    error = $("#loginError"),
    loading = $("#spinnerDiv"),
    button = $("#loginSubmitLabel");

  loginForm.submit(function (event) {
    let emailValue = email.val();
    let passwordValue = password.val();
    error.val("");
    error.hide();
    event.preventDefault();

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
      return;
    }
    let data = {
      email: emailValue,
      password: passwordValue,
    };

    loading.show();
    button.hide();

    //console.log(window.location.href.split("3000")[1]);
    let route = window.location.href.split("3000")[1];
    $.post(route, data, function (data) {
      if (data.auth == true) {
        if (data.user.role == "Admin") {
          window.location.href = "/admin/dashboard";
        } else window.location.href = "/feed";
      } else {
        password.val("");
        error.text(data.error);
        error.show();
        password.focus();
        loading.hide();
        button.show();
      }
    });
  });
})(window.jQuery);
