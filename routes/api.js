var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var db = new firebase('https://tfg2016jjrm.firebaseio.com/');
var ideasURL = 'https://labs.isa.us.es:8181/';
var https = require('https');

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
        //console.log(http);


		//{
        //    url: langURL,
        //    //rejectUnauthorized : false
			////GET /ideas-sedl-language/language HTTP/1.1
			//'Host': 'labs.isa.us.es:8181',
			//'Connection': 'keep-alive',
			//'Pragma': 'no-cache',
			//'Cache-Control': 'no-cache',
			//'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
 		//	'Upgrade-Insecure-Requests': 1,
 		//	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.103 Safari/537.36',
			//'DNT': 1,
			//'Accept-Encoding': 'gzip, deflate, sdch',
			//'Accept-Language': 'en,es;q=0.8',
			//'Cookie': '_ga=GA1.2.1232218510.1442432386'
        //},
    https.get(langURL,
        function (data){
            console.log(data);
			console.log('statusCode: ', data.statusCode);
			console.log('headers: ', data.headers);
            result = data.response;
			res.json(result);

			//res.on('data', function (d) {
			//	//process.stdout.write(d);
			//});
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
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
