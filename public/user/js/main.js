const { use } = require("../../routes/user");

function checkLoginForm(form) {
  let username = document.getElementById("username");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let mobile = document.getElementById("mobile");

  var regex = /^[a-zA-Z\s]+$/;
  if (username.value == "") {
    document.getElementById("nameError").innerHTML = "please enter your name";
    username.focus();
    return false;
  }
  if (regex.test(username.value) === false) {
    document.getElementById("nameError").innerHTML =
      "name should not contain special characters";
    username.focus();
    return false;
  }
  if (email.value == "") {
    document.getElementById("emailError").innerHTML = "please enter your email";
    email.focus();
    return false;
  }
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!re.test(email.value)) {
    document.getElementById("EmailError").innerHTML =
      "please enter a vaild email";
    email.focus();
    return false;
  }
  if(mobile.value == ""){
    document.getElementById("mobileerror").innerHTML = "please enter your mobile number"
    mobile.focus();
    return false;
  }
  if (password.value == "") {
    document.getElementById("passwordError").innerHTML =
      "please enter your password";
    password.focus();
    return false;
  }
  return true;
}
