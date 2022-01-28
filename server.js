'use strict';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  User = require('./models/userModel'),
  jsonwebtoken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mongoose = require('mongoose');
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
const uri = "mongodb+srv://himanshuGarg:7GuwWsawsBn2MqOu@cluster0.xqtgl.mongodb.net/testData?retryWrites=true&w=majority";
mongoose.connect(uri).then(function(){
    //connected successfully
    console.log("db connected...")
}, function(err) {
    //err handle
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
var routes = require('./routes/userRoute');
routes(app);

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log(' RESTful API server started on: ' + port);

module.exports = app;