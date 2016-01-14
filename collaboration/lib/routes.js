
var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = router;

// default path; check for cookie and if it's not there send them to the login page
router.get('/node', function(req, res) {
   res.render('index', {
      title: 'GISportal collaboration'
   });
});

router.get('/node/dashboard', isLoggedIn, function(req, res) {
   var userId = req._passport.session.user.id;
   var displayName = req._passport.session.user.displayName;
   var userEmail = req._passport.session.user.emails[0].value;
   var userPicture = req._passport.session.user._json.picture;
   
   res.render('dashboard', {
      title: 'Collaboration Dashboard',
      userId: userId,
      displayName: displayName,
      userEmail: userEmail,
      userPicture: userPicture
   })
});

router.get('/node/auth/google', passport.authenticate('google'));

router.get('/node/auth/google/callback', 
   passport.authenticate('google', {
     successRedirect: '/node/authorised',
     failureRedirect: '/node/auth-failed'
   })
 );

router.get('/node/authorised', function(req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.render('authorised', {});
})

router.get('/node/logout', function(req, res) {
   req._passport = null;
   res.redirect('/node');
})

function isLoggedIn(req, res, next) {
   if (typeof req._passport.session.user != 'undefined') {
      return next();
   } else {
      res.redirect('/node');
   }
}