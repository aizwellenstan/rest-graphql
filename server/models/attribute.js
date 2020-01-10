const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attributeSchema = new Schema({
  Key: String,
  Value: String,
  Timestamp: Number,
  objectId: String
});

module.exports = mongoose.model("Attribute", attributeSchema);
