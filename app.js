const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const moment = require('moment');

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
  user: "root",
  host: "localhost",
  password: "admin1",
  database: "devlocaltesting",
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
  //console.log(username);
  console.log(password);

  var return_data = {};
  db.query("SELECT * FROM users WHERE account_email_address = ?;",username,(err, result) => 
  {
	  if (err) {res.send({ err: err });}
      //console.log(result);
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
  var RFG87E10=0; var RFG93E10=0;var ULSD=0;var B5=0;var B20=0;var DEF=0; var total=0;
  var totRFG87E10=0; var totRFG93E10=0;var totULSD=0;var totB5=0;var totB20=0;var totDEF=0;
  console.log('..Inside get order summary');
  db.query("SET SESSION sql_mode=''");
  db.query('select id,delivery_number,bill_of_lading_id,max(case when (product_name="UNL 87 RFG ETH 10%") then product_name else NULL end) as "RFG87E10",max(case when (product_name="UNL 87 RFG ETH 10%") then gross_gallons else NULL end) as "UNL87GrossGallons",max(case when (product_name="PREM 93 RFG ETH 10%") then product_name else NULL end) as "RFG93E10",max(case when (product_name="PREM 93 RFG ETH 10%") then gross_gallons else NULL end) as "PREM93GrossGallons",max(case when (product_name="ULSD CLEAR TXLED") then product_name else NULL end) as "ULSD",max(case when (product_name="ULSD CLEAR TXLED") then gross_gallons else NULL end) as "ULSDGrossGallons", max(case when (product_name="B20 Biodiesel") then product_name else NULL end) as "B20",max(case when (product_name="B20 Biodiesel") then gross_gallons else NULL end) as "B20GrossGallons" from store_inventory where dealer="Elan 10" and bol_status_description="Scheduled"  group by delivery_number order by delivery_number;', function (error, schresults, fields) {
    if (error) throw error;
    
    db.query("select store_name,RFG87E10,RFG93E10,ULSD,B5,B20,DEF from price where store_name='Elan 1'", function (error, priceresults, fields) {
      if (error) throw error;
      RFG87E10=priceresults[0].RFG87E10; RFG93E10=priceresults[0].RFG93E10; ULSD=priceresults[0].ULSD;
      B5=priceresults[0].B5; B20=priceresults[0].B20; DEF=priceresults[0].DEF;
      console.log(schresults);
      var length = Object.keys(schresults).length;
      console.log("..length before..."+length);
      for (var i = 0; i < length; i++) 
      {
          total = (RFG87E10 * schresults[i].UNL87GrossGallons) + (RFG93E10 * schresults[i].PREM93GrossGallons) + (ULSD * schresults[i].ULSDGrossGallons) + (B20 * schresults[i].B20GrossGallons);
          schresults[i]['totalamount'] = total;
      }
    })
    return_data.availInventories = schresults;

    db.query("select * from price where store_name='Elan 1'", function (error, results, fields) {
      if (error) throw error;
      return_data.prices = results;
    });

    db.query("SET SESSION sql_mode=''");
    db.query('select id,delivery_number,bill_of_lading_id,max(case when (product_name="UNL 87 RFG ETH 10%") then product_name else NULL end) as "UNL 87 RFG",max(case when (product_name="UNL 87 RFG ETH 10%") then gross_gallons else NULL end) as "UNL87GrossGallons",max(case when (product_name="PREM 93 RFG ETH 10%") then product_name else NULL end) as "PREM 93 RFG",max(case when (product_name="PREM 93 RFG ETH 10%") then gross_gallons else NULL end) as "PREM93GrossGallons",max(case when (product_name="ULSD CLEAR TXLED") then product_name else NULL end) as "ULSD CLEAR TXLED",max(case when (product_name="ULSD CLEAR TXLED") then gross_gallons else NULL end) as "ULSDGrossGallons", max(case when (product_name="B20 Biodiesel") then product_name else NULL end) as "B20 Biodiesel",max(case when (product_name="B20 Biodiesel") then gross_gallons else NULL end) as "B20GrossGallons" from store_inventory where dealer="Elan 10" and bol_status_description="Out for Delivery"  group by delivery_number order by delivery_number;', function (error, intransitresults, fields) {
      if (error) throw error;
      return_data.intransit = intransitresults;
      res.send(return_data);
    });
  });
});


app.post('/getDashboardValues', function (req, res) {
  console.log("....inside the getDashboardValues ");
  //console.log(req);
  var return_data ={};
  var data = [];
  var storename = req.body.storename;
  var invRFG87E10=0, invRFG93E10=0, invULSD=0, invB5=0, invB20=0, invDEF=0;
  var transitRFG87E10=0, transitRFG93E10=0, transitULSD=0, transitB5=0, transitB20=0, transitDEF=0;
  var custRFG87E10=0, custRFG93E10=0, custULSD=0, custB5=0, custB20=0, custDEF=0;
  var summRFG87E10=0, summRFG93E10=0, summULSD=0, summB5=0, summB20=0, summDEF=0;

  var tankproduct="",tanksize=0, tankconnection=false;
  var ullageoutput = []
  var ullagearray = [];
  var ullagetest = {}
  console.log("..storename.............."+storename);
  db.query("select * from elan_cust_prod_summary where name='"+storename+"' and sheduled_or_transit='Scheduled'", function (error, results, fields) {
    invRFG87E10 = results[0].RFG87E10, invRFG93E10 = results[0].RFG93E10, invULSD = results[0].ULSD, invB5 = results[0].B5, invDEF = results[0].DEF,invB20 = results[0].B20;
    if (error) throw error;
    return_data.scheduled = results;
    db.query("select * from elan_cust_prod_summary where name='"+storename+"' and sheduled_or_transit='Transit'", function (error, results, fields) {
      if (error) throw error;
      return_data.transit = results;
    });
    
    db.query("select * from elan_cust_prod_summary where name='"+storename+"' and sheduled_or_transit='Order'", function (error, results, fields) {
      if (error) throw error;
      custRFG87E10 = results[0].RFG87E10, custRFG93E10 = results[0].RFG93E10, custULSD = results[0].ULSD, custB5 = results[0].B5, custDEF = results[0].DEF,custB20 = results[0].B20;
      return_data.custinv = results;
      
    });
    db.query("SET SESSION sql_mode=''");
    db.query("select sum(RFG87E10) as RFG87E10,sum(RFG93E10) as RFG93E10,sum(ULSD) as ULSD,sum(B5) as B5,sum(B20) as B20,sum(DEF) as DEF from elan_cust_prod_summary where name='"+storename+"'", function (error, summaryresults, fields) {
      if (error) throw error;
      summRFG87E10= summaryresults[0].RFG87E10,summRFG93E10= summaryresults[0].RFG93E10,
      summULSD= summaryresults[0].ULSD,summB5= summaryresults[0].B5,
      summB20= summaryresults[0].B20,summDEF= summaryresults[0].DEF
      console.log("..summRFG87E10.."+summRFG87E10);
      ullagearray.push(summRFG87E10), 
      ullagearray.push(summRFG93E10), 
      ullagearray.push(summULSD), 
      ullagearray.push(summB5), 
      ullagearray.push(summB20), 
      ullagearray.push(summDEF);
      // var summRFG87E10=0, summRFG93E10=0, summULSD=0, summB5=0, summB20=0, summDEF=0;
    });
    db.query("select * from store_tanks where store_name='"+storename+"'", function (error, results, fields) {
      if (error) throw error;
      var tankconn = false;
      var length = Object.keys(results).length;
      var total=0;
      for (var i = 0; i < length; i++) 
      {
        if(results[i].tank_connection=true && i==1){
          tankconn=true;
          continue;
        }
         if (tankconn==true){
           total = results[i].tank_size - (ullagearray[i-1]);
           ullagetest[i] = total;
         }else {
           ullagetest[i] = total;
           total = results[i].tank_size - (ullagearray[i]);
         }
         ullageoutput.push(total);
      };
      tankproduct= results[0].tank_product, tankconnection= results[0].tank_connection, tanksize=results[0].tank_size
      //console.log(results);
      //console.log(".....output...."+invRFG87E10,transitRFG87E10,custRFG87E10,tankproduct,tankconnection,tanksize)
      return_data.ullage = ullageoutput;
      var deletedItem = results.splice(1,1);
       return_data.tanks = results;
      res.send(JSON.stringify(return_data));
    });
  });
 });

 app.post('/updateordersummary', function (req, res) {
  console.log("....inside the updateorder summary");
  //console.log(req);
  var return_data ={};
  var data = [];
  var tmpdeliveryboxes = req.body.checkedItems;
  let store_name=req.body.storeid;
  let delivery_amount=900000.00;
  let corporation_name="";customer_address="";customer_email="";customer_phone="";customer_first_name="";customer_last_name="";
  let user_id=req.body.useremail;delivery_number="";bol_status_description="";
  let i;delivery_date="";bill_of_lading_id="";customer="";location_id="";terminal_name="";order_id="123456";
  console.log("..storename..."+req.body.storeid);
  console.log("..user_id..."+user_id);
  let completed="N";
  let totaldeliverynos=0;
  totaldeliverynos=req.body.checkedItems.length;
  
  for (i = 0; i < req.body.checkedItems.length; i++) {
    if (req.body.checkedItems[i]!=null){
      console.log(req.body.checkedItems[i]);
      db.query("select delivery_number,DATE_FORMAT(delivery_date,'%Y-%m-%d %H:%i:%s') AS 'delivery_date' from store_inventory where id='"+req.body.checkedItems[i]+"'", function (error, getdeliveryno, fields) {
        if (error) throw error;
        console.log(getdeliveryno[0].delivery_number + " delivery numbers");
        console.log(" getelsjlj delivery_date + "+ getdeliveryno[0].delivery_date);
        db.query("SET SESSION sql_mode=''");
        db.query("select id,bill_of_lading_id,delivery_date,bol_status_description,max(case when (product_name='UNL 87 RFG ETH 10%') then product_name else NULL end) as 'UNL87RFG',max(case when (product_name='UNL 87 RFG ETH 10%') then gross_gallons else NULL end) as 'UNL87GrossGallons',max(case when (product_name='PREM 93 RFG ETH 10%') then product_name else NULL end) as 'PREM93RFG',max(case when (product_name='PREM 93 RFG ETH 10%') then gross_gallons else NULL end) as 'PREM93GrossGallons',max(case when (product_name='ULSD CLEAR TXLED') then product_name else NULL end) as 'ULSDCLEARTXLED',max(case when (product_name='ULSD CLEAR TXLED') then gross_gallons else NULL end) as 'ULSDGrossGallons', max(case when (product_name='B20 Biodiesel') then product_name else NULL end) as 'B20Biodiesel',max(case when (product_name='B20 Biodiesel') then gross_gallons else NULL end) as 'B20GrossGallons' from store_inventory where delivery_number='"+getdeliveryno[0].delivery_number+"'", function (error, productresults, fields) {
          if (error) throw error;
          console.log("get delivery_number...."+getdeliveryno[0].delivery_number);
          bol_status_description=productresults[0].bol_status_description;

          if(productresults[0].UNL87RFG=='UNL 87 RFG ETH 10%' && (productresults[0].UNL87GrossGallons >0)){
            price_per_gallons="1.75";
            console.log("....get delivery date for prod price..."+getdeliveryno[0].delivery_date);
            var sql = "INSERT INTO orders_prod_price_map(delivery_number,product_name,store_name,price_per_gallons,gallons,delivery_date,sheduled_or_transit) VALUES ('"+getdeliveryno[0].delivery_number+"','"+productresults[0].UNL87RFG+"','"+store_name+"','"+price_per_gallons+"',"+productresults[0].UNL87GrossGallons+",'"+getdeliveryno[0].delivery_date+"','"+bol_status_description+"')";
            db.query(sql, function (err, result) {if (err) throw err;console.log(result.affectedRows + " record(s) updated");
            });
            console.log("...before scheduled..and store name....."+store_name);
              db.query("select RFG87E10 from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'", function (error, prodresults, fields) {
                if (error) throw error;
                updRFG87E101=prodresults[0].RFG87E10;
                if(updRFG87E101 >= (productresults[0].UNL87GrossGallons)) {
                  updRFG87E101 = updRFG87E101 - productresults[0].UNL87GrossGallons;
                  var sql = "UPDATE elan_cust_prod_summary SET RFG87E10 = "+updRFG87E101+", cust_or_dealer='"+customer+"' WHERE name = '"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'";
                  db.query(sql, function (err, result) {
                  if (err) throw err;
                    //console.log(result.affectedRows + "update......");
                  });
                }
              });
              console.log("...before orders..and store name....."+store_name);
              db.query("select RFG87E10 from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='Order'", function (error, orderresults, fields) {
                if (error) throw error;
                updRFG87E10=orderresults[0].RFG87E10;
                if(updRFG87E10=="NaN"){updRFG87E10=0;}
                 updRFG87E10 = updRFG87E10 + productresults[0].UNL87GrossGallons;
                 var sql = "UPDATE elan_cust_prod_summary SET RFG87E10 = "+updRFG87E10+" WHERE name = '"+store_name+"' and sheduled_or_transit='Order'";
                db.query(sql, function (err, result) {
                if (err) throw err;
                  //console.log(result.affectedRows + "update......");
                });
              });
          }
          if(productresults[0].PREM93RFG=='PREM 93 RFG ETH 10%' && (productresults[0].PREM93GrossGallons >0)){
            price_per_gallons="1.75";
            var sql = "INSERT INTO orders_prod_price_map(delivery_number,product_name,store_name,price_per_gallons,gallons,delivery_date,sheduled_or_transit) VALUES ('"+getdeliveryno[0].delivery_number+"','"+productresults[0].PREM93RFG+"','"+store_name+"','"+price_per_gallons+"',"+productresults[0].PREM93GrossGallons+",'"+getdeliveryno[0].delivery_date+"','"+bol_status_description+"')";
            db.query(sql, function (err, result) {if (err) throw err;console.log(result.affectedRows + " record(s) updated");
            });
            db.query("select RFG93E10 from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'", function (error, prodresults, fields) {
              if (error) throw error;
              updPREM93RFG=prodresults[0].RFG93E10;
              console.log("...insdie the before update function..."+updPREM93RFG);
              if(updPREM93RFG >= (productresults[0].PREM93GrossGallons)){
                 updPREM93RFG = updPREM93RFG - productresults[0].PREM93GrossGallons;
                var sql = "UPDATE elan_cust_prod_summary SET RFG93E10 = "+updPREM93RFG+", cust_or_dealer='"+customer+"' WHERE name = '"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'";
                db.query(sql, function (err, result) {
                if (err) throw err;
                  //console.log(result.affectedRows + "update......");
                });
              }
            });
            db.query("select RFG93E10 from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='Order'", function (error, prodresults, fields) {
              if (error) throw error;
              updPREM93RFG=prodresults[0].RFG93E10;
              if(updPREM93RFG=="NaN"){updPREM93RFG=0;}
              console.log("...insdie the before update function..."+updPREM93RFG);
              updPREM93RFG = updPREM93RFG + productresults[0].PREM93GrossGallons;
              var sql = "UPDATE elan_cust_prod_summary SET RFG93E10 = "+updPREM93RFG+" WHERE name = '"+store_name+"' and sheduled_or_transit='Order'";
              db.query(sql, function (err, result) {
              if (err) throw err;
                //console.log(result.affectedRows + "update......");
              });
            });
          }          
          if(productresults[0].ULSDCLEARTXLED=='ULSD CLEAR TXLED' && (productresults[0].ULSDGrossGallons >0)){
            price_per_gallons="1.75";
            var sql = "INSERT INTO orders_prod_price_map(delivery_number,product_name,store_name,price_per_gallons,gallons,delivery_date,sheduled_or_transit) VALUES ('"+getdeliveryno[0].delivery_number+"','"+productresults[0].ULSDCLEARTXLED+"','"+store_name+"','"+price_per_gallons+"',"+productresults[0].ULSDGrossGallons+",'"+getdeliveryno[0].delivery_date+"','"+bol_status_description+"')";
            db.query(sql, function (err, result) {if (err) throw err;console.log(result.affectedRows + " record(s) updated");
            });
            db.query("select ULSD from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'", function (error, prodresults, fields) {
              if (error) throw error;
              updULSD=prodresults[0].ULSD;
              console.log("...insdie the before update function..."+updULSD);
              if(updULSD >= (productresults[0].ULSDGrossGallons)){
                updULSD = updULSD - productresults[0].ULSDGrossGallons;
                var sql = "UPDATE elan_cust_prod_summary SET ULSD = "+updULSD+" WHERE name = '"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'";
                db.query(sql, function (err, result) {
                if (err) throw err;
                  //console.log(result.affectedRows + "update......");
                });
              }
            });
            db.query("select ULSD from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='Order'", function (error, prodresults, fields) {
              if (error) throw error;
              updULSD=prodresults[0].ULSD;
              if(updULSD=="NaN"){updULSD=0;}
              console.log("...insdie the before update function..."+updULSD);
                updULSD = updULSD + productresults[0].ULSDGrossGallons;
                var sql = "UPDATE elan_cust_prod_summary SET ULSD = "+updULSD+", cust_or_dealer='"+customer+"' WHERE name = '"+store_name+"' and sheduled_or_transit='Order'";
                db.query(sql, function (err, result) {
                if (err) throw err;
                  //console.log(result.affectedRows + "update......");
                });
            });
          }
          if(productresults[0].B20Biodiesel=='B20 Biodiesel' && (productresults[0].B20GrossGallons >0)){
            price_per_gallons="1.75";
            var sql = "INSERT INTO orders_prod_price_map(delivery_number,product_name,store_name,price_per_gallons,gallons,delivery_date,sheduled_or_transit) VALUES ('"+getdeliveryno[0].delivery_number+"','"+productresults[0].B20Biodiesel+"','"+store_name+"','"+price_per_gallons+"',"+productresults[0].B20GrossGallons+",'"+getdeliveryno[0].delivery_date+"','"+bol_status_description+"')";
            db.query(sql, function (err, result) {if (err) throw err;console.log(result.affectedRows + " record(s) updated");
            });
            db.query("select B20 from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'", function (error, prodresults, fields) {
              if (error) throw error;
               updB20=prodresults[0].B20;
               if(updB20 >= (productresults[0].B20GrossGallons)){
                  updB20 = updB20 - productresults[0].B20GrossGallons;
                  var sql = "UPDATE elan_cust_prod_summary SET B20 = "+updB20+", cust_or_dealer='"+customer+"' WHERE name = '"+store_name+"' and sheduled_or_transit='"+bol_status_description+"'";
                  db.query(sql, function (err, result) {
                  if (err) throw err;
                    //console.log(result.affectedRows + "update......");
                  });
                }
            });
            db.query("select B20 from elan_cust_prod_summary where name='"+store_name+"' and sheduled_or_transit='Order'", function (error, prodresults, fields) {
              if (error) throw error;
               updB20=prodresults[0].B20;
               if(updB20=="NaN"){updB20=0;}
               updB20 = updB20 - productresults[0].B20GrossGallons;
                  var sql = "UPDATE elan_cust_prod_summary SET B20 = "+updB20+" WHERE name = '"+store_name+"' and sheduled_or_transit='Order'";
                  db.query(sql, function (err, result) {
                  if (err) throw err;
                    //console.log(result.affectedRows + "update......");
                  });
            });
          }
          console.log("....before start order placement...");
          db.query("select delivery_date,bill_of_lading_id,customer,location_id,terminal_name from store_inventory where delivery_number='"+getdeliveryno[0].delivery_number+"'", function (error, invresults, fields) {
            if (error) throw error;
            bill_of_lading_id=invresults[0].bill_of_lading_id;
            customer=invresults[0].customer;location_id=invresults[0].location_id;
            terminal_name=invresults[0].terminal_name;
            db.query("select corporation_name from store where store_name='"+store_name+"'", function (error, storeresults, fields) {
              if (error) throw error;
              corporation_name=storeresults[0].corporation_name;
              console.log("...corporation_name..."+corporation_name);
              db.query("select customer_first_name,customer_last_name,customer_address_1,customer_email,customer_phone_1 from customer where corporation_name='"+corporation_name+"'", function (error, customeresults, fields) {
                if (error) throw error;
              customer_first_name=customeresults[0].customer_first_name;       
              customer_last_name=customeresults[0].customer_last_name;       
              customer_address=customeresults[0].customer_address_1;       
              customer_email=customeresults[0].customer_email;
              customer_phone=customeresults[0].customer_phone_1;
              console.log("..customer_phone..."+customer_phone);
              order_id="or_"+moment(Date.now()).format('YYYYMMDD')+"_"+getdeliveryno[0].delivery_number;
              console.log("..order_id..."+order_id);
              console.log("....before order placement...");
              var sql = "INSERT INTO orders_placement(delivery_number,bill_of_lading_id,customer,location_id,terminal_name,user_id,order_id,store_name,delivery_amount,customer_address,customer_email,customer_phone,delivery_date,customer_first_name,customer_last_name) VALUES ('"+getdeliveryno[0].delivery_number+"','"+bill_of_lading_id+"','"+customer+"','"+location_id+"','"+terminal_name+"','"+user_id+"','"+order_id+"','"+store_name+"',"+delivery_amount+",'"+customer_address+"','"+customer_email+"','"+customer_phone+"','"+ getdeliveryno[0].delivery_date+"','"+customer_first_name+"','"+customer_last_name+"')";
              db.query(sql, function (err, result) {
                 if (err) throw err;
                  console.log("order placement record inserted");
                  if (i==totaldeliverynos){
                    var sql = "UPDATE store_inventory SET bol_status_description = 'Completed' WHERE delivery_number = '"+getdeliveryno[0].delivery_number+"'";   
                    db.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log(result.affectedRows + " record(s) updated");
                      console.log("....success............................");
                      res.send({ success: "yes" });
                    });
                  } 
                 });
              });
              console.log("....after order placement...");
            });

          });
        });   
      });      
     }
  }
});

app.get('/storeusers', function (req, res) {
  console.log(req.checkbox);
  db.query('select * from users', function (error, results, fields) {
   if (error) throw error;
   console.log(JSON.stringify(results));
   res.end(JSON.stringify(results));
 });
});

