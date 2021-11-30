$(document).ready(function () {
  //display success and error notification notifications on home page
  function sendNotification(message,notificationType){
    new Noty({
      theme: "relax",
      text: message,
      type: notificationType,
      layout: "topCenter",
      timeout: 2000,
    }).show();

  }
  
  if (document.getElementById("Snotification")) {
    sendNotification(document.getElementById("Snotification").innerText,"success");
  }

  if (document.getElementById("errorNotification")) {
    sendNotification(document.getElementById("errorNotification").innerText,"warning");
  }

  /* On batch form button click show form */
  $("#batchForm").hide();

  // $("#courseForm").click(function (e) {
  //   let courseForm = function (id) {
  //     console.log("courseForm called");
  //     return $(`<div id="courseForm">
  //                   <form action="/create-course" method="POST" >
  //                     <label for="name">Course Name:</label> &nbsp;
  //                     <input id="name"  type="text" name="courseName" required /> <br>
  //                     <input  type="submit" id="submit">
  //                   </form>
  //               </div>`
  //             );
  //   };

  //   $("#courseForm").hide(100);

  //   let form = courseForm();
  //   $("#courseFormArea").prepend(form);
  // });

  $("#batchFormBttn").click(function (e) {
    $("#batchFormBttn").hide();
    $("#batchForm").show();
  });
});
