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
  $.ajax({
    url: "/addCart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#cartCount").html();
        count = parseInt(count) + 1;
        $("#cartCount").html(count);
      }
    },
  });
  // fetch("http://localhost:8000/addCart/" + proId, {
  //   method: "get"
  // })
  // .then((res) => res.json())
  // .then((res) => {
  //   if (res.status) {
  //     const toastLiveExample = document.getElementById("liveToast");
  //     const toast = new bootstrap.Toast(toastLiveExample);

  //           toast.show();
  //   }
  // }).catch(err => {
  //   console.log(err)
  // })
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
          location.reload();
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