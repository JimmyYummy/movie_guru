// Add Passport-related auth routes here.

const express = require('express');

const router = express.Router();
module.exports = (passport) => {
  // load login page
  // router.get('/login', (req, res) => {
  //   const user = req.session.customErr;
  //   delete req.session.customErr;
  //   res.render('login', { layout: false, error: req.query.error, user });
  // });
  //
  // // handles user login, redirecting based on user type
  // router.post('/login', passport.authenticate('local', { failureRedirect: '/login?error=true' }), (req, res) => {
  //   const [returnTo] = [req.session.returnTo];
  //   delete req.session.returnTo;
  //   res.redirect(returnTo || '/');
  // });

  router.get('/login', (req, res) => {
    res.render('login', { layout: false });
  });

  router.get('/auth/facebook',
    passport.authenticate('facebook'));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  // handles user logout
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  // the wall


  return router;
};
