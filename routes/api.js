var express = require('express');
var router = express.Router();
var querystring = require('querystring');
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

router.get('/language/:languagePath', function(req, res, next) {
	var options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.languagePath+ "/language",
			method: 'GET',
			rejectUnauthorized: false
		},
		request = https.request(options, function(response) {
			response.on('data', function(d) {
				try {
					var data = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(d)));
					res.json(data);
				} catch (e) {
					console.log(e);
				}
			});
		});

	request.on('error', function(e) {
		console.error(e);
	});

	request.end();
});

router.post('/checklanguage/:language/format/:format', function(req, res, next) {
	var data = querystring.stringify(req.body),
		headers = req.headers,
		options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.language+ "/language/format/" + req.params.format + "/checkLanguage",
			method: 'POST',
			rejectUnauthorized: false,
			headers: headers
		},
		request = https.request(options, function(response) {
			response.on('data', function(d) {
				try {
					var data = JSON.parse(d.toString());
					res.json(data);
				} catch (e) {
					console.log(e);
				}
			});
		});

	request.on('error', function(e) {
		console.error(e);
	});

	request.write(data);
	request.end();
});


router.post('/convert/:language', function(req, res, next) {
	var data = querystring.stringify(req.body),
		options = {
			host: 'labs.isa.us.es',
			port: 8181,
			path: '/' + req.params.language+ "/language/convert",
			method: 'POST',
			rejectUnauthorized: false,
			headers: req.headers
		},
		request = https.request(options, function (response) {
			var result='';

			response.on('data', function (d) {
				result += d.toString();
			});

			response.on('end', function(){
				try {
					var data = JSON.parse(result);
					res.json(data);
				} catch (e) {
					console.error(e);
				}
			});
		});

	request.on('error', function (e) {
		console.error(e);
	});

	request.write(data);
	request.end();
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
