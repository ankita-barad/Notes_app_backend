const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./db");
const { userRoute } = require("./routes/user.route");
const { notesRouter } = require("./routes/notes.route");
const { auth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/note", notesRouter);

app.listen(3300, async () => {
  await connection;
  console.log("server connected");
});
