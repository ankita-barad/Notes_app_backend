const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

require("dotenv").config();

const { connection } = require("./db");
const { userRoute } = require("./routes/user.route");
const { notesRouter } = require("./routes/notes.route");
const { auth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes app",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3300",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const Specification = swaggerJsdoc(options);
app.use("/api-notesApp-docs", swaggerUi.serve, swaggerUi.setup(Specification));

app.use("/user", userRoute);
app.use("/note", notesRouter);

app.listen(3300, async () => {
  await connection;
  console.log("server connected");
});
