{
  // convert the object to csv
  const objectToCSV = function (data) {
    //generate header
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));

    //loop over rows
    for (let row of data) {
      let values = headers.map((header) => {
        let quoteEsc = ("" + row[header]).replace(/"/g, '\\"');
        return `"${quoteEsc}"`;
      });

      csvRows.push(values.join(","));
    }

    // form escaped comma values
    return csvRows.join("\n");
  };

  // download the csv file in local computer
  const download = function (csvData) {
    let blob = new Blob([csvData], { type: "text/csv" }); // blob is used to download things
    let url = window.URL.createObjectURL(blob); // create url version of object you want to download with the help of windows
    let a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "Student_Interview_Data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // fetch data to be exported from the server
  const getData = async function () {
    const dataURL = "/interviews/exportCSV";
    const res = await fetch(dataURL);
    const json = await res.json();

    const data = json.map((row) => ({
      student_Id: row.student._id,
      name: row.student.firstName + " " + row.student.lastName,
      email: row.student.email,
      college: row.student.college,
      batch: row.student.batch.batchName,
      WebDscore: row.student.WebDscore,
      ReactScore: row.student.ReactScore,
      DSAscore: row.student.DSAscore,
      status: row.student.status,
      company: row.interview.company,
      interviewDate: row.interview.interviewDate,
      result: row.result,
    }));

    const csvData = objectToCSV(data);
    download(csvData);
  };

  // call getData method on button click
  $(document).on("click", ".csvBttn", function () {
    getData();
  });
}
