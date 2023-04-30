const express = require("express");
const { NotesModel } = require("../models/notes.model");
const { UserModel } = require("../models/user.model");
const { auth } = require("../middleware/auth");

const notesRouter = express.Router();

notesRouter.get("/", auth, async (req, res) => {
  let data = await UserModel.findById({ _id: req.body.userId }).populate(
    "notes"
  );
  res.json({ data: data });
});
notesRouter.get("/:id", auth, async (req, res) => {
  let { id } = req.params;
  let note = await NotesModel.findById(id);
  res.json(note);
});

notesRouter.post("/create", auth, async (req, res) => {
  await NotesModel.insertMany([req.body]).then(async (id, err) => {
    if (err) {
      console.log(err);
    }
    if (id) {
      console.log(id);
      let user = await UserModel.findOne({ _id: req.body.userId });
      user.notes.push(id[0]["_id"]);
      console.log(user);
      await UserModel.findByIdAndUpdate({ _id: req.body.userId }, user);
    }
  });
  res.json({ msg: "Notes added" });
});

notesRouter.patch("/update/:id", auth, async (req, res) => {
  let note = await NotesModel.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );
  res.json({ msg: "notes updated" });
});

notesRouter.delete("/delete/:id", auth, async (req, res) => {
  console.log("hello");
  let note = await NotesModel.findOneAndDelete({ _id: req.params.id });
  console.log(note);
  res.json({ msg: "note deleted" });
});

module.exports = { notesRouter };
