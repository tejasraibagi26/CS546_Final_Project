const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const error = document.getElementById("loginError");

  loginForm.addEventListener("submit", (event) => {
    let emailValue = email.value;
    let passwordValue = password.value;

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
      email.value = "";
      error.innerHTML = e;
      error.hidden = false;
      email.focus();
      event.preventDefault();
      return;
    }

    try {
      if (!passwordValue) throw "Must provide password";
      if (passwordValue.trim().length == 0) throw "Must provide password";
    } catch (e) {
      password.value = "";
      error.innerHTML = e;
      error.hidden = false;
      password.focus();
      event.preventDefault();
      return;
    }
  });
}
