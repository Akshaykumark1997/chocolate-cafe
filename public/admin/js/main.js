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
