const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  ObjectId: String
});

module.exports = mongoose.model("Author", authorSchema);
