const express = require('express');
const Models = require('../models/models');
const connection = require('../sqlConnection');
const router = express.Router();
const search = require('../helpers/search');
const defSearch = require('../helpers/defSearch');


router.get('/', (req, res, next) => {
  var search_param = req.query.search_term;
  if (search_param === '' || search_param === undefined) {
  	defSearch( function(results){
	    res.render('index', { movie: 'no search!', movies:results });
  	});
  } else {
    search(search_param, function (results) {
      res.render('index', { movie: search_param, movies:results  });
    });
  }
});

module.exports = router;
