const mongoose = require("mongoose");
const resultSchema = mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"student",
    },
    interview:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"interview",
    },
    result:{
        type:String,
        default:"--None--",
    }
},{typeStamp:true});

const result =mongoose.model("result",resultSchema);
module.exports = result;