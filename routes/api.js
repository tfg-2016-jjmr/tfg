var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var db = new firebase('https://tfg2016jjrm.firebaseio.com/');


router.get('/test', function(req, res, next) {
	res.json({firstname: 'John', lastname: 'Doe' });
});

router.post('/test', function(req,res, next){
	console.log(req);
});

router.get('/test/:id', function(req,res, next) {
	var id = req.params.id;
	if(id < 10 && id > 0){
		res.json({ic: id, firstname: 'john', lastname: 'Doe'})
	}else {
		res.status(500).json({error: 'There is no such user'})
	}
});

router.delete('/test/:id', function(req,res){
	var id = req.params.id;
	console.log('New DELETE request for user with id '+id);
});

module.exports = router;
