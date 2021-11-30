$(document).ready(function () {
  // initialization
  $(".updateBttn").hide();
  $(".cancelBttn").hide();
  $("#studentForm").hide();
  $(".batchInput").hide();
  $(".statusInput").hide();

  // send notification function
  function sendNotification(message,notificationType){
    new Noty({
      theme: "relax",
      text: message,
      type: notificationType,
      layout: "topCenter",
      timeout: 2000,
    }).show();

  }

  // show form on "student" button click
  $("#studentFormBttn").click(function (e) {
    $("#studentFormBttn").hide();
    $("#studentForm").show();
  });

  // submit student form to add new student
  $("#submit-student").click(function (e) {
    e.preventDefault();
    console.log("button pressed");
    var formData = document.getElementById("studentForm");
    var fd = new FormData(formData);
    var formDataObj = {};
    for (var [key, value] of fd.entries()) {
      formDataObj[key] = value;
    }

    console.log(formDataObj);

    $.ajax({
      url: "/students/create",
      method: "POST",
      data: formDataObj,
      success: function (data, success) {
        console.log(data);
        console.log(success);
        if (success === "success") {
          if (data.userFound) {
            sendNotification(`Student with email: ${data.email} already exist.`, "warning");
          } else {
            sendNotification("Student Created","success");
            setTimeout(function(){
              location.reload();
            },2000);
            
          }
        }
      },
    });
  });

  // edit student row
  $(document).on("click",".editBttn",function(){
    let student = $(this).attr("studentId");
    let elem = $(this).closest("tr");
    elem.find(".updateBttn").show();
    elem.find(".cancelBttn").show();
    elem.find(".deleteBttn").hide();
    elem.find(".editBttn").hide();
    elem.find(".batch").hide();
    elem.find(".status").hide();
    elem.find(".batchInput").show();
    elem.find(".statusInput").show();

    elem.find(".rowData").each(function(){
      $(this).attr("originalData", $(this).html());
      $(this).attr("contenteditable", "true");
    });



  });

  // cancel the edit
  $(document).on("click", ".cancelBttn", function () {
    let elem = $(this).closest("tr");
    elem.find(".updateBttn").hide();
    elem.find(".cancelBttn").hide();
    elem.find(".deleteBttn").show();
    elem.find(".editBttn").show();
    elem.find(".batch").show();
    elem.find(".status").show();
    elem.find(".batchInput").hide();
    elem.find(".statusInput").hide();
    elem.find(".rowData").each(function () {
      $(this).html($(this).attr("originalData"));
    });
  });

  //send new data to server on update button click
  $(document).on("click",".updateBttn",function(){
    let elem = $(this).closest("tr");
    let dataObj = {}
    elem.find(".rowData").each(function () {
      let colName = $(this).attr("colName");
      if(colName){
        let val = $(this).html();
        dataObj[colName] = val;
        console.log("colName: ",colName ,"  val: ",val);
      }

    });
    dataObj.batch =  elem.find(".batchIn").val();
    dataObj.status = elem.find(".statusIn").val();
    dataObj.studentId =elem.attr("studentId");


    console.log(dataObj);
    $.ajax({
      url: "/students/update",
      method: "POST",
      data: dataObj,
      success: function (data, success) {
        console.log(data);
        console.log(success);
        if (success === "success") {
          sendNotification("Student Updated","success");
            setTimeout(function(){
              location.reload();
            },2000);
        }
      },
    });
  
  })
});
