var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var db = new firebase('https://tfg2016jjrm.firebaseio.com/');
var ideasURL = 'https://labs.isa.us.es:8181/';
var https = require('https');
var fs = require('fs');
var path = require('path');

router.get('/configuration', function(req, res, next) {
    var oJSON = {
		"languages": {
			"ideas-sedl-language": "/ideas-sedl-language",
			"iagree-template-language": "/ideas-iagree-template-language",
			"iagree-offer-language": "/ideas-iagree-offer-language",
			"iagree-agreement-language": "/ideas-iagree-agreement-language",
			"ideas-opl-language": "/ideas-opl-language",
			"ideas-afm-language": "/ideas-afm-language",
			"ideas-fmc-language": "/ideas-fmc-language",
			"ideas-hcs-language": "/ideas-hcs-language",
			"ideas-needs-language": "/ideas-needs-language",
			"ideas-plaintext-language": "/ideas-plaintext-language",
			"ideas-csv-language": "/ideas-csv-language",
			"ideas-lusdl-language": "/ideas-lusdl-language",
			"ideas-html-language": "/ideas-html-language",
			"ideas-soup-language": "/ideas-soup-language",
			"ideas-json-language": "/ideas-json-language",
			"ideas-yaml-language": "/ideas-yaml-language"
		},
		"images": {
			"logo": "ideas/appLogoBig.png",
			"search": "ideas/Search.png"
		},
		// "googleAnalyticsID": "UA-68297022-1",
		// "configurationFiles": {
		//     "application": "classpath*:application.properties",
		//     "security": "classpath*:security.properties",
		//     "social": "classpath*:social.properties",
		//     "email": "classpath*:email.properties"
		// }
		// "workbenchName": "IDEAS",
		// "helpURI": "https://labs.isa.us.es/IDEAS-help/"
		"baseURI": "https://labs.isa.us.es:8181/"
	};
    
    res.json(oJSON);
});

router.get('/language/:id', function(req, res, next) {
    var langURL = ideasURL + req.params.id + "/language",
		result;
        console.log(langURL);

	var options = {
		host: 'labs.isa.us.es',
		port: 8181,
		path: '/' + req.params.id + "/language",
		method: 'GET',
		rejectUnauthorized: false
	};

	var request = https.request(options, function(response) {
		console.log('statusCode: ', response.statusCode);
		console.log('headers: ', response.headers);

		response.on('data', function(d) {
			res.json(JSON.parse(String.fromCharCode.apply(null, new Uint8Array(d))));
		});
	});
	request.end();

	request.on('error', function(e) {
		console.error(e);
	});
});

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
