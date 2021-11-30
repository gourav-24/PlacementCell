$(document).ready(function () {

  $("#InterviewForm").hide();
  $(".result-input").hide();
  $(".updateBttn").hide();

  // Add student form button
  $("#InterviewFormBttn").click(function (e) {
    $("#InterviewFormBttn").hide();
    $("#InterviewForm").show();
  });

  // request to add student in interview's student list
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
    if (formDataObj.interviewDate < today) {
      alert("interview Date cant be less than todays date");
      return;
    }
    console.log(formDataObj);

    $.ajax({
      url: "/interviews/add",
      method: "POST",
      data: formDataObj,
      success: function (data, success) {
        console.log(data);
        console.log(success);
        if (success === "success") {
          alert(data);
          location.reload();
        }
      },
    });
  });

  //show result picklist on clicking on result
  $(document).on("click", ".result", function (event) {
    console.log("result clicked");
    let divElem = $(this).closest("tr");
    console.log(">>divElem: ", divElem);
    divElem.find(".result").hide();
    divElem.find(".remove").hide();
    divElem.find(".delete").addClass("update");
    divElem.find(".delete").removeClass("delete");
    divElem.find(".result-input").show();
    divElem.find(".updateBttn").show();
  });

  // send update result request when update button is clicked
  $(document).on("click", ".updateBttn", function () {
    console.log("result clicked");
    let divElem = $(this).closest("tr");
    let newVal = divElem.find("#resultPicklist").val();
    let resultID = $(this).attr("resultId");
    $.ajax({
      url: "/interviews/updateResult",
      method: "POST",
      data: {
        pickListVal: newVal,
        resultId: resultID,
      },
      success: function (data, success) {
        console.log(data);
        console.log(success);
        if (success === "success") {
          console.log("success");
          location.reload();
        }
      },
      error: function (err) {
        console.log("error: ", err);
      },
    });
  });

  // remove a student from interview list
  $(document).on("click", ".remove", function () {
    let resultId = $(this).attr("resultId");
    let interviewId = $(this).attr("interviewId");

    $.ajax({
      url: "/interviews/removeStudent",
      method: "POST",
      data: {
        interviewID: interviewId,
        resultID: resultId,
      },
      success: function (data, success) {
        console.log(data);
        console.log(success);
        if (success === "success") {
          console.log("success");
          location.reload();
        }
      },
      error: function (err) {
        console.log("error: ", err);
      },
    });
  });
});
