const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
  title: { type: String },
  body: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const NotesModel = mongoose.model("note", notesSchema);
module.exports = { NotesModel };
