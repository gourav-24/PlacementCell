const mongoose = require("mongoose");
const interviewSchema = mongoose.Schema({
    company:{
        type: "String",
        required: true,
    },
    StudentList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student",
      }
    ],
    interviewDate:{
        type:"Date",
    }
});

const interview = mongoose.model("interview",interviewSchema);
module.exports = interview; 