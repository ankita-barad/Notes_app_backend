const express = require("express");
const { NotesModel } = require("../models/notes.model");
const { UserModel } = require("../models/user.model");
const { auth } = require("../middleware/auth");

const notesRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     note:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The notes title
 *         body:
 *           type: string
 *           description: The notes body
 *
 */

/**
 * @swagger
 * tags:
 *  name: note
 *  description: All the routes related to notes
 */

/**
 * @swagger
 * /note:
 *  get:
 *      summary: This  will get all the notes of  user who is logged in
 *      tags: [note]
 *      responses:
 *          200:
 *             description: The list of all notes
 *
 *          400:
 *             description: Incorrect request!
 *             content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/note"
 *
 *
 */

notesRouter.get("/", auth, async (req, res) => {
  let data = await UserModel.findById({ _id: req.body.userId }).populate(
    "notes"
  );
  res.json({ data: data });
});

/**
 * @swagger
 * /note/:id:
 *  get:
 *      summary: This  will get specific notes of logged in user
 *      tags: [note]
 *      responses:
 *          200:
 *             description: This will get the notes
 *
 *          400:
 *             description: Incorrect request!
 *             content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/note"
 *
 *
 */
notesRouter.get("/:id", auth, async (req, res) => {
  let { id } = req.params;
  let note = await NotesModel.findById(id);
  res.json(note);
});

/**
 * @swagger
 * /note/create:
 *  post:
 *      summary: To post  a new notes
 *      tags: [note]
 *      responses:
 *          200:
 *             description: new notes successfully created
 *
 *          400:
 *             description: Incorrect request!
 *             content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/note"
 *
 *
 */

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

/**
 * @swagger
 * /note/update/:id:
 *  patch:
 *      summary: To update  a  notes
 *      tags: [note]
 *      responses:
 *          200:
 *             description:  notes was successfully updated
 *
 *          400:
 *             description: Incorrect request!
 *             content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/note"
 *
 *
 */

notesRouter.patch("/update/:id", auth, async (req, res) => {
  let note = await NotesModel.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );
  res.json({ msg: "notes updated" });
});

/**
 * @swagger
 * /note/delete/:id:
 *  delete:
 *      summary: To delete  a  notes
 *      tags: [note]
 *      responses:
 *          200:
 *             description:  notes was successfully deleted
 *
 *          400:
 *             description: Incorrect request!
 *             content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/note"
 *
 *
 */

notesRouter.delete("/delete/:id", auth, async (req, res) => {
  console.log("hello");
  let note = await NotesModel.findOneAndDelete({ _id: req.params.id });
  console.log(note);
  res.json({ msg: "note deleted" });
});

module.exports = { notesRouter };
