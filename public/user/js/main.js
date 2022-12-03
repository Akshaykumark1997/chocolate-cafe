/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
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
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  if (!re.test(email.value)) {
    document.getElementById("EmailError").innerHTML =
      "please enter a vaild email";
    email.focus();
    return false;
  }
  if (mobile.value == "") {
    document.getElementById("mobileerror").innerHTML =
      "please enter your mobile number";
    mobile.focus();
    return false;
  }
  const mob = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (mob.test(mobile.value) === false) {
    document.getElementById("mobileerror").innerHTML =
      "mobile number should be 10 digits";
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

function addToCart(proId) {
  const value = "sorry !!! currently out of stock";
  $.ajax({
    url: "/addCart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#cartCount").html();
        count = parseInt(count) + 1;
        $("#cartCount").html(count);
      }else{
        $("#stock").html(value);
          window.location.reload();
      }
    },
  });
}

function changeQuantity(cartId, productId, count) {
  let quantity = parseInt(document.getElementById("quantity").innerHTML);
  $.ajax({
    url: "/changeQuantity",
    data: {
      cart: cartId,
      product: productId,
      count: count,
    },
    method: "post",
    success: () => {
      document.getElementById("quantity").innerHTML = quantity + count;
      window.location.reload();
    },
  });
}
function removeProduct(cartId, productId) {
  $.ajax({
    url: "/removeProduct",
    data: {
      cart: cartId,
      product: productId,
    },
    method: "post",
    success: () => {
      location.reload();
    },
  });
}



function eiditForm(form) {
  let fullname = document.getElementById("fullname");
  let housename = document.getElementById("housename");
  let area = document.getElementById("area");
  let landmark = document.getElementById("landmark");
  let city = document.getElementById("city");
  let state = document.getElementById("state");
  let pincode = document.getElementById("pincode");

  var regex = /^[a-zA-Z\s]+$/;
  if (fullname.value == "") {
    document.getElementById("nameError").innerHTML =
      "please enter your full name";
    fullname.focus();
    return false;
  }
  if (regex.test(fullname.value) === false) {
    document.getElementById("nameError").innerHTML =
      "fullname should be alphabets";
    fullname.focus();
    return false;
  }
  if (housename.value == "") {
    document.getElementById("houseError").innerHTML =
      "please enter your house name";
    housename.focus();
    return false;
  }
  if (regex.test(housename.value) === false) {
    document.getElementById("houseError").innerHTML =
      "housename should be alphabets";
    housename.focus();
    return false;
  }
  if (area.value == "") {
    document.getElementById("areaError").innerHTML = "please enter your area";
    area.focus();
    return false;
  }
  if (regex.test(area.value) === false) {
    document.getElementById("areaError").innerHTML = "area should be alphabets";
    area.focus();
    return false;
  }
  if (landmark.value == "") {
    document.getElementById("landmarkError").innerHTML =
      "please enter your landmark";
    landmark.focus();
    return false;
  }
  if (regex.test(landmark.value) === false) {
    document.getElementById("landmarkError").innerHTML =
      "landmark should be alphabets";
    landmark.focus();
    return false;
  }
  if (city.value == "") {
    document.getElementById("cityError").innerHTML = "please enter your city";
    city.focus();
    return false;
  }
  if (regex.test(city.value) === false) {
    document.getElementById("cityError").innerHTML = "city should be alphabets";
    city.focus();
    return false;
  }
  if (state.value == "") {
    document.getElementById("stateError").innerHTML = "please enter your state";
    state.focus();
    return false;
  }
  if (regex.test(state.value) === false) {
    document.getElementById("stateError").innerHTML =
      "state should be alphabets";
    state.focus();
    return false;
  }
  if (pincode.value == "") {
    document.getElementById("pincodeError").innerHTML =
      "please enter your pincode";
    pincode.focus();
    return false;
  }

  if (isNaN(pincode.value)) {
    document.getElementById("pincodeError").innerHTML =
      "pincode should be digits";
    pincode.focus();
    return false;
  }
  return true;
}

function addressForm(form) {
  let housename = document.getElementById("housename");
  let area = document.getElementById("area");
  let landmark = document.getElementById("landmark");
  let city = document.getElementById("city");
  let state = document.getElementById("state");
  let pincode = document.getElementById("pincode");

  var regex = /^[a-zA-Z\s]+$/;
  if (housename.value == "") {
    document.getElementById("houseError").innerHTML =
      "please enter your house name";
    housename.focus();
    return false;
  }
  if (regex.test(housename.value) === false) {
    document.getElementById("houseError").innerHTML =
      "housename should be alphabets";
    housename.focus();
    return false;
  }
  if (area.value == "") {
    document.getElementById("areaError").innerHTML = "please enter your area";
    area.focus();
    return false;
  }
  if (regex.test(area.value) === false) {
    document.getElementById("areaError").innerHTML = "area should be alphabets";
    area.focus();
    return false;
  }
  if (landmark.value == "") {
    document.getElementById("landmarkError").innerHTML =
      "please enter your landmark";
    landmark.focus();
    return false;
  }
  if (regex.test(landmark.value) === false) {
    document.getElementById("landmarkError").innerHTML =
      "landmark should be alphabets";
    landmark.focus();
    return false;
  }
  if (city.value == "") {
    document.getElementById("cityError").innerHTML = "please enter your city";
    city.focus();
    return false;
  }
  if (regex.test(city.value) === false) {
    document.getElementById("cityError").innerHTML = "city should be alphabets";
    city.focus();
    return false;
  }
  if (state.value == "") {
    document.getElementById("stateError").innerHTML = "please enter your state";
    state.focus();
    return false;
  }
  if (regex.test(state.value) === false) {
    document.getElementById("stateError").innerHTML =
      "state should be alphabets";
    state.focus();
    return false;
  }
  if (pincode.value == "") {
    document.getElementById("pincodeError").innerHTML =
      "please enter your pincode";
    pincode.focus();
    return false;
  }

  if (isNaN(pincode.value)) {
    document.getElementById("pincodeError").innerHTML =
      "pincode should be digits";
    pincode.focus();
    return false;
  }
  return true;
}
