$(document).ready(function () {

  // show interview form after button click
    $("#InterviewForm").hide();
    $("#InterviewFormBttn").click(function (e) {
      $("#InterviewFormBttn").hide();
      $("#InterviewForm").show();
    });
  

    // create new interview record 
    $("#submit-interview").click(function (e) {
         
      e.preventDefault();

      var formData = document.getElementById("InterviewForm");
      var fd = new FormData(formData);
      var formDataObj = {};
      for (var [key, value] of fd.entries()) {
        formDataObj[key] = value;
      }

      let today = new Date();
      console.log(today);
      // check date
      if(formDataObj.interviewDate<today){
        alert("interview Date cant be less than todays date");
        return;
      }
      console.log(formDataObj);
  
      $.ajax({
        url: "/interviews/create",
        method: "POST",
        data: formDataObj,
        success: function (data, success) {
          console.log(data);
          console.log(success);
          if (success === "success") {
            if (data.userFound) {
              alert("interview already exist");
            } else {
              alert("Interview Created");
              location.reload();
            }
          }
        },
      });
    });
  });
  