const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "smart-brain",
  },
});

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.use(express.json());
app.use(cors());

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`app is running on port ${PORT}`);
});

console.log(PORT);
