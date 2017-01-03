'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
	res.send('Bonjour, je m\'apelle Gibbs et je suis un chat bot');
});

// Webhook route - Facebook authentication and verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'your_password') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Erreur, mauvais token');
});

// Index politique-confidentialite-fb.html
app.get('/politique-confidentialite-fb.html', function (req, res) {
	res.sendFile(path.join(__dirname + '/politique-confidentialite-fb.html'));
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

//Send Gibbs rules in random
function sendGibbsRules(sender) {
    var rules = [
	"1. Ne jamais laisser deux suspects ensemble dans la même pièce.", 
	"1bis. Ne jamais trahir son partenaire.", 
	"2. Toujours porter des gants sur une scène de crime.",
	"3. Ne croyez jamais ce que l'on vous dit, toujours vérifier.",
	"3bis. Ne jamais être injoignable.",
	"4. La meilleure façon de garder un secret est de ne le révéler à personne.",
	"5. Ne pas gâcher le talent.",
	"6. Ne jamais dire qu'on est désolé. C'est un signe de faiblesse.",
	"7. Toujours être précis lorsque vous mentez.",
	"8. Ne jamais rien prendre pour acquis.",
	"9. Toujours avoir un couteau sur soi.",
	"10. Ne jamais s'impliquer personnellement dans une enquête.",
	"11. Quand le boulot est fini, on s'en va.",
	"12. Ne jamais fréquenter un collègue.",
	"13. Ne jamais impliquer un avocat.",
	"13.bis Les règles sont faites pour être enfreintes.",
	"15. Toujours travailler en équipe.",
	"16. Si quelqu'un pense avoir la mainmise, brise-le.",
	"17. Ne jamais frapper un marine.",
	"18. Il vaut mieux rechercher le pardon que demander la permission.",
	"22. Ne jamais interrompre Gibbs pendant un interrogatoire.",
	"23. Ne jamais jouer avec le café d'un Marine si vous tenez à la vie.",
	"26. Ne jamais laisser quelqu'un vous manipuler.",
	"27. Il y a 2 méthodes pour une filature. La 1ère : ils ne vous remarquent pas. La 2ème : ils ne remarquent que vous.",
	"35. Toujours observer ceux qui observent.",
	"36. Si vous avez le sentiment qu'on vous manipule, c'est probablement le cas.",
	"38. Ton affaire, ton enquête.",
	"39. Les coincidences, ça n'existe pas.",
	"40. Si tu as le sentiment qu'on cherche à te coincer, c'est que c'est le cas.",
	"42. Ne jamais accepter d'excuses de quelqu'un qui vient de vous trahir.",
	"44. Les priorités d'abord. Cacher les femmes et les enfants.",
	"45. Toujours nettoyer la pagaille qu'on a semée.",
	"51. Parfois, tu as tort.",
	"69. Ne jamais croire une femme qui ne fait pas confiance à son homme."
    ];
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
