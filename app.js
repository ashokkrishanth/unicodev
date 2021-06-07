const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
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


const db = mysql.createConnection({
  user: "unicodevserver@unicoelanserver",
  host: "unicoelanserver.mysql.database.azure.com",
  password: "P@ssword",
  database: "devtesting",
});

app.get('/test', (req, res) => {
  res.send('Welcome to the backend node js!');
});

app.get('/storeusers', function (req, res) {
  console.log(req.checkbox);
  db.query('select * from users', function (error, results, fields) {
   if (error) throw error;
   console.log(JSON.stringify(results));
   res.end(JSON.stringify(results));
 });
});

