const express = require('express');
const Models = require('../models/models');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { movie: 'Star Wars', button: true });
});

router.get('/no_button', (req, res, next) => {
  res.render('index', { movie: 'No Movie', button: false });
});

router.post('/api_endpoint/:parameter', (req, res, next) => {
  console.log(`body: ${req.body.message}`);
  console.log(`paramter: ${req.params.parameter}`);
  console.log(`query: ${req.query.query_message}`);
});

module.exports = router;
