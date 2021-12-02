const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("emailRegister");
  const firstPassword = document.getElementById("firstPassword");
  const secondPassword = document.getElementById("confirmPassword");
  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  const role = document.getElementById("role");
  const error = document.getElementById("registerError");

  registerForm.addEventListener("submit", (event) => {
    let firstNameValue = firstName.value;
    let lastNameValue = lastName.value;
    let emailValue = email.value;
    let firstPasswordValue = firstPassword.value;
    let secondPasswordValue = secondPassword.value;
    let ageValue = age.value;
    let genderValue = gender.value;
    let roleValue = role.value;
    error.hidden = true;

    try {
      if (!firstNameValue) throw "Must provide first name";
      if (firstNameValue.trim().length == 0) throw "Must provide first name";
    } catch (e) {
      firstName.value = "";
      error.innerHTML = e;
      error.hidden = false;
      firstName.focus();
      event.preventDefault();
      return;
    }

    try {
      if (!lastNameValue) throw "Must provide last name";
      if (lastNameValue.trim().length == 0) throw "Must provide last name";
    } catch (e) {
      lastName.value = "";
      error.innerHTML = e;
      error.hidden = false;
      lastName.focus();
      event.preventDefault();
      return;
    }

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
      if (!firstPasswordValue) throw "Must provide a password";
      if (firstPasswordValue.trim().length == 0)
        throw "Must provide a password";
    } catch (e) {
      firstPassword.value = "";
      error.innerHTML = e;
      error.hidden = false;
      firstPassword.focus();
      event.preventDefault();
      return;
    }

    try {
      if (!secondPasswordValue) throw "Must confirm password";
      if (secondPasswordValue.trim().length == 0) throw "Must confirm password";
      if (secondPasswordValue != firstPasswordValue)
        throw "Passwords must match";
    } catch (e) {
      secondPassword.value = "";
      error.innerHTML = e;
      error.hidden = false;
      secondPassword.focus();
      event.preventDefault();
      return;
    }

    try {
      if (!ageValue) throw "Must provide an age";
      if (ageValue.trim().length == 0) throw "Must provide an age";
    } catch (e) {
      age.value = "";
      error.innerHTML = e;
      error.hidden = false;
      age.focus();
      event.preventDefault();
      return;
    }

    try {
      if (!genderValue) throw "Must provide a gender";
      if (genderValue.trim().length == 0) throw "Must provide a gender";
    } catch (e) {
      error.innerHTML = e;
      error.hidden = false;
      event.preventDefault();
      return;
    }

    try {
      if (!roleValue) throw "Must provide a role";
      if (roleValue.trim().length == 0) throw "Must provide a role";
    } catch (e) {
      error.innerHTML = e;
      error.hidden = false;
      event.preventDefault();
      return;
    }
  });
}
