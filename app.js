const registerForm = document.querySelector("#registration");
const loginForm = document.querySelector("#login");
const errorDisplay = document.querySelector("#errorDisplay");
const errorMessage = document.querySelector("#errorMessage");

const rUserInput = document.querySelector("#rUserInput");
const rUserPattern = /^[a-zA-Z0-9]{4,}$/;
const lUserInput = document.querySelector("#lUserInput");

const rEmailInput = document.querySelector("#rEmailInput");
const rEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const rPassInput = document.querySelector("#rPassInput");
const rPassPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}/;
const rPassConfirm = document.querySelector("#rPassConfirm");
const lPassInput = document.querySelector("#lPassInput");

const tosAgreed = document.querySelector("#tosAgreed");
const keepMeCheck = document.querySelector("#keepMeCheck");
let validUser = false;
let validPass = false;
let validEmail = false;

registerForm.addEventListener("change", function (event) {
  event.preventDefault();
  const rUserUnique = new Set(rUserInput.value);
  errorDisplay.style.display = "none";
  console.log(rUserInput.value);
  console.log(rUserUnique);
  console.log(validUser);
  if (rUserInput.value.length <= 0) {
    errorMessage.textContent = "The username cannot be blank.";
    errorDisplay.style.display = "flex";
  } else if (rUserInput.value.length < 4) {
    errorMessage.textContent =
      "The username must be at least four characters long.";
    errorDisplay.style.display = "flex";
  } else if (rUserUnique.size < 2) {
    errorMessage.textContent =
      "The username must contain two unique characters.";
    errorDisplay.style.display = "flex";
  } else if (!rUserPattern.test(rUserInput.value)) {
    errorMessage.textContent =
      "The username cannot contain any special characters or whitespace.";
    errorDisplay.style.display = "flex";
  } else if (!rEmailPattern.test(rEmailInput.value)) {
    errorMessage.textContent = "Please enter a valid email address.";
    errorDisplay.style.display = "flex";
  } else if (rEmailInput.value.includes("example.com")) {
    errorMessage.textContent = "example.com is not a valid domain name.";
    errorDisplay.style.display = "flex";
  } else {
    validEmail = true;
    validUser = true;
  }
});

rPassInput.addEventListener("input", function (event) {
  event.preventDefault();
  console.log(validPass);
  if (rPassInput.value.length < 12) {
    errorMessage.textContent = "Passwords must be at least 12 characters";
    errorDisplay.style.display = "flex";
  } else if (!rPassPattern.test(rPassInput.value)) {
    errorMessage.textContent =
      "Password must contain at least one number, one uppercase and lowercase letter, one special character and at least 12 or more characters";
    errorDisplay.style.display = "flex";
  } else if (rPassInput.value.toUpperCase().includes("PASSWORD")) {
    errorMessage.textContent = "Passwords cannot contain the word password";
    errorDisplay.style.display = "flex";
  } else if (
    rPassInput.value.toUpperCase().includes(rUserInput.value.toUpperCase())
  ) {
    errorMessage.textContent = "Passwords cannot contain your username";
    errorDisplay.style.display = "flex";
  } else validPass = true;
});

rPassConfirm.addEventListener("input", function (event) {
  event.preventDefault();

  if (rPassConfirm.value === rPassInput.value) {
    return;
  } else {
    errorMessage.textContent = "Passwords must match";
    errorDisplay.style.display = "flex";
  }
});

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (tosAgreed.checked === false) {
    errorMessage.textContent = "You must agree to the terms and conditions";
    errorDisplay.style.display = "flex";
  } else if (validEmail === true && validUser === true && validPass === true) {
    let rUserName = rUserInput.value.toLowerCase();
    let rPassword = rPassInput.value;
    let rEmail = rEmailInput.value.toLowerCase();

    let existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    let isExistingUser = existingUsers.some(function (user) {
      return user.rUserName === rUserName;
    });
    let isExistingEmail = existingUsers.some(function (user) {
      return user.rEmail === rEmail;
    });

    if (isExistingUser) {
      errorMessage.textContent =
        "This username is already registered. Please try a different username.";
      errorDisplay.style.display = "flex";
    } else if (isExistingEmail) {
      errorMessage.textContent =
        "This email is already registered. Please use a different email.";
      errorDisplay.style.display = "flex";
    } else {
      existingUsers.push({ rUserName, rPassword, rEmail });
      localStorage.setItem("users", JSON.stringify(existingUsers));
      registerForm.reset();
      alert("Registration successful!");
    }
  } else {
    errorMessage.textContent = "Invalid email, username or password";
    errorDisplay.style.display = "flex";
  }
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  errorDisplay.style.display = "none";
  let existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  let lUserName = lUserInput.value.toLowerCase();
  let lPassword = lPassInput.value;
  let isExistingUserLogin = existingUsers.some(function (user) {
    return user.rUserName === lUserName;
  });

  let loginCheck = existingUsers.some(function (user) {
    return user.rUserName === lUserName && user.rPassword === lPassword;
  });

  if (lUserInput.value.length > 0) {
    if (lPassInput.value.length > 0) {
      if (isExistingUserLogin) {
        if (loginCheck) {
            if (keepMeCheck.checked === true) {
            alert("login successful, you will be kept logged in");
            loginForm.reset();
          } else {
            alert("login successful!");
            loginForm.reset();
          }
        } else {
          errorMessage.textContent = "The password is incorrect";
          errorDisplay.style.display = "flex";
        }
      } else {
        errorMessage.textContent = "This username does not exist";
        errorDisplay.style.display = "flex";
      }
    } else {
      errorMessage.textContent = "Password cannot be empty";
      errorDisplay.style.display = "flex";
    }
  } else {
    errorMessage.textContent = "Username cannot be empty";
    errorDisplay.style.display = "flex";
  }
});

loginForm.addEventListener("input", function (event) {
  errorDisplay.style.display = "none";
  console.log(lUserInput.value);
  console.log(keepMeCheck);
});
