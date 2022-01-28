'use strict';
var session = require('express-session');
var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');

  exports.register = function(req, res) {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        user.hash_password = undefined;
        return res.json(user);
      }
    });
  };
  
  exports.sign_in = function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
      }
      session=req.session;
      session.userid=req.body.email;
      console.log(session)
      return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
    });
  };
  
  exports.sign_out = function(req, res) {
    if (session.userid) {
      req.session.destroy();
      console.log(session);
      return res.status(200).json({ message: 'User logged out successfully!!' });
      } 
    else {
        return res.status(400).json({ message: 'User not logged in!!' });
      }
  };

  exports.loginRequired = function(req, res, next) {
    if (req.user) {
      next();
    } else {
  
      return res.status(401).json({ message: 'Unauthorized user!!' });
    }
  };

  exports.profile = function(req, res, next) {
    if (req.user) {
      res.send(req.user);
      console.log(session.userid);
      next();
    } 
    else {
     return res.status(401).json({ message: 'Invalid token' });
    }
  };