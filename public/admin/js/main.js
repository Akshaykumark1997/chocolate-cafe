/* eslint-disable no-unused-vars */
function validateCategory(form){
    let category = document.getElementById("category");
    if(category.value === ""){
         document.getElementById("categoryError").innerHTML =
           "please enter category";
            category.focus();
            return false;
    }
    return true;
}
function validateEditCategory(form) {
  let categorys = document.getElementById("categorys");
  if (categorys.value === "") {
    document.getElementById("categorysError").innerHTML =
      "please enter category";
    categorys.focus();
    return false;
  }
  return true;
}

function validateAddProduct(form){
    let username = document.getElementById("product");
    let price = document.getElementById("price");
    let description = document.getElementById("description");
    let stock = document.getElementById("stock");
    let file = document.getElementById("file-input");

    var regex = /^[a-zA-Z\s]+$/;
    if (username.value == "") {
      document.getElementById("nameError").innerHTML = "please enter product name";
      username.focus();
      return false;
    }
    if (regex.test(username.value) === false) {
      document.getElementById("nameError").innerHTML =
        "product name should not contain special characters";
      username.focus();
      return false;
    }
    if (price.value == "") {
      document.getElementById("priceError").innerHTML =
        "please enter your price";
      price.focus();
      return false;
    }
    if (price.value < 0) {
      document.getElementById("priceError").innerHTML =
        "price must be a positive value";
      price.focus();
      return false;
    }
     if (description.value == "") {
       document.getElementById("descriptionError").innerHTML =
         "please enter your description";
       description.focus();
       return false;
     }
    if (stock.value == "") {
      document.getElementById("stockError").innerHTML =
        "please enter stock";
      stock.focus();
      return false;
    }
    if (stock.value<0) {
      document.getElementById("stockError").innerHTML =
        "stock must be a positive value";
      stock.focus();
      return false;
    }
   if(file.value ==""){
    document.getElementById("fileError").innerHTML=
    "plese upload image";
    file.focus();
    return false;
   }

    return true;
}
function validateAddCoupon(form) {
  let coupon = document.getElementById("coupon");
  let discount = document.getElementById("discount");
  let max = document.getElementById("max");
  let exdate = document.getElementById("exdate");
  if (coupon.value == "") {
    document.getElementById("couponError").innerHTML =
      "please enter product name";
    coupon.focus();
    return false;
  }
  if (discount.value == "") {
    document.getElementById("discountError").innerHTML = "please enter your discount";
    discount.focus();
    return false;
  }
  if (discount.value < 0) {
    document.getElementById("discountError").innerHTML =
      "discount must be a positive value";
    discount.focus();
    return false;
  }
  if (max.value == "") {
    document.getElementById("maxError").innerHTML =
      "please enter your max";
    max.focus();
    return false;
  }
  if (max.value < 0) {
    document.getElementById("maxError").innerHTML =
      "max must be a positive value";
    max.focus();
    return false;
  }
  if (exdate.value == "") {
    document.getElementById("exdateError").innerHTML = "please enter exdate";
    exdate.focus();
    return false;
  }
  if (exdate.value < 0) {
    document.getElementById("exdateError").innerHTML =
      "exdate must be a positive value";
    exdate.focus();
    return false;
  }
  return true;
}
function validateEditCoupon(form) {
  let coupon = document.getElementById("coupon");
  let discount = document.getElementById("discount");
  let max = document.getElementById("max");
  let exdate = document.getElementById("exdate");
  if (coupon.value == "") {
    document.getElementById("couponNameError").innerHTML =
      "please enter coupon name";
    coupon.focus();
    return false;
  }
  if (discount.value == "") {
    document.getElementById("discountsError").innerHTML =
      "please enter your discount";
    discount.focus();
    return false;
  }
  if (discount.value < 0) {
    document.getElementById("discountError").innerHTML =
      "discount must be a positive value";
    discount.focus();
    return false;
  }
  if (max.value == "") {
    document.getElementById("maxlError").innerHTML = "please enter your max";
    max.focus();
    return false;
  }
  if (max.value < 0) {
    document.getElementById("maxError").innerHTML =
      "max must be a positive value";
    max.focus();
    return false;
  }
  if (exdate.value == "") {
    document.getElementById("expdateError").innerHTML = "please enter exdate";
    exdate.focus();
    return false;
  }
  if (exdate.value < 0) {
    document.getElementById("exdateError").innerHTML =
      "exdate must be a positive value";
    exdate.focus();
    return false;
  }
  return true;
}