'use strict';
module.exports = function(app) {
    var userHandlers = require('../controllers/userController.js');
    app.route('/profile')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/auth/register')
        .post(userHandlers.register);
   app.route('/auth/sign_in')
        .post(userHandlers.sign_in);
   app.route('/sign_out')
        .post(userHandlers.sign_out);
};