'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, je suis un chat bot');
});

// Webhook route - Facebook authentication and verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'your_password') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Erreur, mauvais token');
});

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});

//Facebook page access token
var token = "EAAFAFUFdjecBAOkw3fNa8Fgc9YVO6X3RZAOLr1TEsrIUWs153Rna78o3Epy7zktZAtd2aBu2ZCmmZChZAu9AZAW5No22biwiKAZB4jMxNcBs8bGtsCk9Ov5UATohoNfgDK2tvgJ1PH1Q9lya4qIbW5Y8wnSouqOe1QGkiYydBAknQZDZD";

//Get messages
app.post('/webhook/', function (req, res) {
var messaging_events = req.body.entry[0].messaging
for (var i = 0; i < messaging_events.length; i++) {
	var event = req.body.entry[0].messaging[i];
	var sender = event.sender.id;
	if (event.message && event.message.text) {
		var text = event.message.text;
            if (text === 'gibbs') {
                //sendCardMessage(sender);
		    sendGibbsRules(sender);
	            continue;
	        }
			//sendTextMessage(sender, "Message reçu : " + text.substring(0, 200));
		}		
		//Reagir au click sur un bouton d'une card
		if (event.postback) {
			var text = JSON.stringify(event.postback);
			sendTextMessage(sender, "Postback reçu : "+text.substring(0, 200), token);
			continue;
      }
		
	}
	
		
	res.sendStatus(200);
});

//Send messages
function sendTextMessage(sender, text) {
    var messageText = { text:text };
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageText,
	        }
	    }, function(error, response, body) {
	        if (error) {
	            console.log('Une erreur est survenue : ', error);
	        } else if (response.body.error) {
	            console.log('Erreur: ', response.body.error);
	        }
	    });
}

//TODO Send Gibbs rules
function sendGibbsRules(sender) {
    var rules = ["Good!", "Great!", "Awesome!", "Super!", "Nice!"];
    var text = rules[Math.floor(Math.random() * rules.length)];
    var messageText = { text:text };
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageText,
                }
            }, function(error, response, body) {
                if (error) {
                    console.log('Une erreur est survenue : ', error);
                } else if (response.body.error) {
                    console.log('Erreur: ', response.body.error);
                }
            });
}

//Send card messages
function sendCardMessage(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Premiere carte",
                    "subtitle": "Element 1 de la liste",
	                    "image_url": "http://blog.casino770.com/media/blogs/fr4/quick-uploads/p4834/ncis.jpg?mtime=1468820328",
	                    "buttons": [{
	                        "type": "web_url",
	                        "url": "https://www.messenger.com",
	                        "title": "Visiter le site"
	                    }, {
	                        "type": "postback",
	                        "title": "Acheter",
	                        "payload": "Clic sur la premiere carte",
	                    }],
	                }, {
	                    "title": "Deuxieme carte",
	                    "subtitle": "Element numero 2 de la liste",
	                    "image_url": "http://papystreaming.com/fr/files/2012/07/NCIS.jpg",
	                    "buttons": [{
	                        "type": "postback",
	                        "title": "Acheter",
	                        "payload": "Clic sur la deuxieme carte",
	                    }],
	                }]
	            }
	        }
	    };
	    request({
	        url: 'https://graph.facebook.com/v2.7/me/messages',
	        qs: {access_token:token},
	        method: 'POST',
	        json: {
	            recipient: {id:sender},
	            message: messageData,
	        }
	    }, function(error, response, body) {
	        if (error) {
	            console.log('Erreur pendant l\'envoi du message ', error)
	        } else if (response.body.error) {
	            console.log('Erreur: ', response.body.error)
	        }
	    });
}
