const mongoose = require("mongoose");

const batchSchema = mongoose.Schema(
  {
    batchName: {
      type: String,
      unique: true,
    },
  },
  { timeStamps: true }
);

const Batch = mongoose.model("batch", batchSchema);
module.exports = Batch;
