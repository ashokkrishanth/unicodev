const express = require("express");
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


app.get('/test', (req, res) => {
  res.send('Welcome to the backend node js!');
});



