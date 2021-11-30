console.log("signup handler loaded");
$(document).ready(function () {
  // on submitting sign up form
  $("#submit-button").click(function (event) {
    console.log("button pressed");
    event.preventDefault();
    
    // form object data 
    var formData = document.getElementById("myform");
    var fd = new FormData(formData);
    var formDataObj = {};
    for (var [key, value] of fd.entries()) {
      formDataObj[key] = value;
    }
    function sendNoti(message) {
      new Noty({
        theme: "relax",
        text: message,
        type: "warning",
        layout: "topCenter",
        timeout: 4000,
      }).show();
    }

    // check for password
    if (formDataObj.password !== formDataObj.confirmPass) {
      sendNoti("Entered Password and Confirm Password don't match");
      return;
    }

    console.log(formDataObj);

    // send request to create a user
    $.ajax({
      url: "/users/create",
      method: "POST",
      data: formDataObj,
      success: function (data, success) {
        console.log(data);
        console.log(success);
        if (success === "success") {
          if (data.userFound) {
            sendNoti(
              `User with email: ${data.email} already exist. You can try signing on Sign In page.`
            );
            return;
          } else {
            sendNoti("User created successfully");
          }
        }
      },
    });
  });
});
