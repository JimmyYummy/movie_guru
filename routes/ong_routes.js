const express = require('express');
const Models = require('../models/models');
const connection = require('../sqlConnection');
const router = express.Router();

// Uncomment lines 7-13 to see example of how to use search function
const search = require('../helpers/search');
router.get('/', (req, res, next) => {
    // var srcTerm= document.getElementById('searchBar');
    console.log('\n\n\n' + 
    	'_________________________________________________________________________________' +
    	 req.query.search_term +
    	 '_________________________________________________________________________________'+
    	 '\n\n\n');
    search('Love Is', function (results) {
        // console.log(results);
        res.render('index', { movie: results[0].title, button: true });
    });
});

router.get('/', (req, res, next) => {
  connection.query('SELECT COUNT(*) AS count FROM Crew_In', function (err, result) {
    if (err) throw err;
    res.render('index', { movie: result[0].count, button: true });
  });
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
