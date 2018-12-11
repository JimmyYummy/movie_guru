const express = require('express');
const router = express.Router();
module.exports = (passport) => {
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

  // the wall, redirects to login if not signed in
  router.use((req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    return next();
  });

  return router;
};
