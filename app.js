const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

/*
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "admin1",
  database: "testing",
});
*/

const db = mysql.createConnection({
  user: "mysqladmin@zcumysqlunico",
  host: "zcumysqlunico.mysql.database.azure.com",
  password: "P@ssword",
  database: "devtesting",
});

app.get("/login", (req, res) => {
  console.log("inside the get login");
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get('/test', (req, res) => {
  res.send('Welcome to the backend node js!');
});

app.post("/login", (req, res) => {
  console.log("inside the post login");
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  db.query(
    "SELECT * FROM store_users WHERE account_email_address = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            //console.log(req.session.user);
            res.send(result);
          } else {
            console.log(".....wrong password.......");
            res.send({ wrongpwd: "yes" });
          }
        });
      } else {
        console.log(".....no account.......");
        res.send({ noaccount: "yes"});
      }
    }
  );
});

app.get('/storeusers', function (req, res) {
  console.log(req);
  db.query('select * from store_users', function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});

app.get('/storeusers/:username', function (req, res) {
  db.query('select * from store_users where account_email_address=?', [req.params.username], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});

app.listen(3001, () => {
  console.log("running server");
});
