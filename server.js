const IsOnDev = true;

module.exports = {
  IsOnDev,
};

// ! Import dependencies
const express = require("express");
const app = express();

const bcrypt = require("bcryptjs");
const cors = require("cors");

const knex = require("knex");

const db = IsOnDev
  ? knex({
      client: "pg",
      connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "123",
        database: "smart-brain",
      },
    })
  : knex({
      client: "pg",
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });

// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });
// ! Use Middleware
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

console.log(PORT);

// ! Import Controllers
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// ! Cretea Router Backend
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
