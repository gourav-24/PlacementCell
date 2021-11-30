/* establish connection with database local DB */
// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/placemetCellDB");
// const db = mongoose.connection;

// db.on(
//   "error",
//   console.error.bind(console, "error while connecting to database")
// );
// db.once("open", function () {
//   console.log("successfully connected to database");
// });

// establishing connection with cloud databse
const mongoose =require('mongoose');
const uri = "mongodb+srv://GauravPlacementCell:fYH7-6*K.92NY7A@cluster0.bsylp.mongodb.net/PlacementCell?retryWrites=true&w=majority";
mongoose.connect(uri,{ 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  
});
    const db = mongoose.connection;
    db.on('error',console.error.bind(console,'error in connecting to mongo db data base'));
    db.once('open',function(){
        console.log("succesfully connected to mongo db");
    });
module.exports = db;