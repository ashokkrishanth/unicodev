const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

var port = process.env.PORT || 3000;
app.get('/test', (req,res) => res.send('Hello testing Ashok Pandian'));
app.listen(port, () => console.log('Server is running on port'+port));

app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
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
  
  app.get("/login", (req, res) => {
    console.log("inside the get login");
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  });

  
app.post("/login", (req, res) => {
  console.log("inside the post login");
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);

  var return_data = {};
  //db.query("SELECT * FROM store_users WHERE account_email_address = ?;",username,(err, result) => 
  db.query("SELECT * FROM users WHERE account_email_address = ?;",username,(err, result) => 
  {
	  if (err) {res.send({ err: err });}
      console.log(result);
		  if (result.length > 0) {
			  bcrypt.compare(password, result[0].user_password, (error, response) => {
				  if (response) 
				  {	
					  req.session.user = result;console.log("success.."+result[0].store_name);
					  return_data.store_users = result;
            res.send(return_data);
				  }else {console.log(".....wrong123 password.......");res.send({ wrongpwd: "yes" });}
			});
		  }else {console.log(".....no account.......");res.send({ noaccount: "yes"});}
     });
			
  });
  

app.get('/getordersummary', function (req, res) {
  //console.log(req);
  var return_data ={};
  var data = [];
  console.log('..Inside get order summary');
  db.query("SET SESSION sql_mode=''");
  db.query('select id,delivery_number,bill_of_lading_id,max(case when (product_name="UNL 87 RFG ETH 10%") then product_name else NULL end) as "UNL 87 RFG",max(case when (product_name="UNL 87 RFG ETH 10%") then gross_gallons else NULL end) as "UNL87GrossGallons",max(case when (product_name="PREM 93 RFG ETH 10%") then product_name else NULL end) as "PREM 93 RFG",max(case when (product_name="PREM 93 RFG ETH 10%") then gross_gallons else NULL end) as "PREM93GrossGallons",max(case when (product_name="ULSD CLEAR TXLED") then product_name else NULL end) as "ULSD CLEAR TXLED",max(case when (product_name="ULSD CLEAR TXLED") then gross_gallons else NULL end) as "ULSDGrossGallons", max(case when (product_name="B20 Biodiesel") then product_name else NULL end) as "B20 Biodiesel",max(case when (product_name="B20 Biodiesel") then gross_gallons else NULL end) as "B20GrossGallons" from store_inventory where dealer="Elan 10" and bol_status_description="Scheduled" group by bill_of_lading_id order by bill_of_lading_id', function (error, results, fields) {
    if (error) throw error;
    return_data.availInventories = results;

    db.query("select * from price where store_name='Elan 1'", function (error, results, fields) {
      if (error) throw error;
      return_data.prices = results;
    });

    db.query('select id,delivery_number,bill_of_lading_id,max(case when (product_name="UNL 87 RFG ETH 10%") then product_name else NULL end) as "UNL 87 RFG",max(case when (product_name="UNL 87 RFG ETH 10%") then gross_gallons else NULL end) as "UNL87GrossGallons",max(case when (product_name="PREM 93 RFG ETH 10%") then product_name else NULL end) as "PREM 93 RFG",max(case when (product_name="PREM 93 RFG ETH 10%") then gross_gallons else NULL end) as "PREM93GrossGallons",max(case when (product_name="ULSD CLEAR TXLED") then product_name else NULL end) as "ULSD CLEAR TXLED",max(case when (product_name="ULSD CLEAR TXLED") then gross_gallons else NULL end) as "ULSDGrossGallons", max(case when (product_name="B20 Biodiesel") then product_name else NULL end) as "B20 Biodiesel",max(case when (product_name="B20 Biodiesel") then gross_gallons else NULL end) as "B20GrossGallons" from store_inventory where dealer="Elan 10" and bol_status_description="Out for Delivery" group by bill_of_lading_id order by bill_of_lading_id', function (error, intransitresults, fields) {
      if (error) throw error;
      return_data.intransit = intransitresults;
   //   console.log(return_data);
        res.send(return_data);
    });
  });
});


app.post('/updateordersummary', function (req, res) {
  console.log("....inside the updateorder summary");
  //console.log(req);
  var return_data12 ={};
  var data = [];
  var test = req.body.checkedItems12;
  var i;
  for (i = 0; i < req.body.checkedItems12.length; i++) {
     if (req.body.checkedItems12[i]!=null){
      console.log(req.body.checkedItems12[i]);
      var sql = "UPDATE test_inventory SET bol_status_description = 'Completed' WHERE id = '"+req.body.checkedItems12[i]+"'";
      db.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      });
    }
    //console.log(req);
  }

  res.send(return_data12);
});


  app.get('/storeusers', function (req, res) {
    console.log(req);
    db.query('select * from users', function (error, results, fields) {
     if (error) throw error;
     res.send(JSON.stringify(results));
   });
  });
  
  app.get('/storeusers/:username', function (req, res) {
    db.query('select * from users where account_email_address=?', [req.params.username], function (error, results, fields) {
     if (error) throw error;
     res.send(JSON.stringify(results));
   });
  });
  
