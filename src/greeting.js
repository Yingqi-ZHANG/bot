
var request = require("request");
var SparkBot = require("node-sparkbot");
var bot = new SparkBot();
//bot.interpreter.prefix = "#"; // Remove comment to overlad default / prefix to identify bot commands

var SparkAPIWrapper = require("node-sparkclient");
if (!process.env.SPARK_TOKEN) {
  console.log("Could not start as this bot requires a Cisco Spark API access token.");
  process.exit(1);
}
var spark = new SparkAPIWrapper(process.env.SPARK_TOKEN);

//var spark = new SparkAPIWrapper("NTRhMmRlMWYtZGZlOS00YmQ2LTk4YzgtMDhhMDMxZDRmNTg3YzJlMzY3NjgtMjU4");
//finit state machine
var currentState = 000;
var email = "BotPostalTest@sparkbot.io";
bot.onMessage(function (trigger, message) {
  console.log("new message from: " + trigger.data.personEmail + ", text: " + message.text);
  var command = bot.asCommand(message);
  switch (currentState) {
    case 000:{
      //state 000 ==> 000
      if((!command) && ("BotPostalTest@sparkbot.io"!= message.personEmail)){
        spark.createMessage(message.roomId, message000, { "markdown":true }, function(err, message) {
          if (err) {
            console.log("WARNING: could not post Mention message to room: " + trigger.data.roomId);
            return;
          }
        });
      }
      if (command) {
        switch (command.keyword) {
          //state 000 ==> 100
          case "1":{
            email=command.message.personEmail;
            console.log(message100);
            spark.createMessage(message.roomId, message100, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("1WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            currentState = 100;
            break;
          }
          //state 000 ==> 200
          case "2":{
            spark.createMessage(message.roomId, message200, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("2WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            currentState = 200;
            break;
          }
          //state 000 ==> 300
          case "3":{
            spark.createMessage(message.roomId, message300, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("16WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            currentState = 300;
            break;
          }
          //state 000==>000
          case "4":{
            spark.createMessage(message.roomId, messageInfoBot, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("3WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            break;
          }
          //state 000 ==> 000
          default:{
            spark.createMessage(message.roomId, message000, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("4WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            spark.createMessage(message.roomId, messageInfoBot, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("5WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
          }
        }
        console.log("detected command: " + command.keyword + ", with args: " + JSON.stringify(command.args));
      }
      break;
    }
    //saluer
    case 100:{
      if((!command) && ("BotPostalTest@sparkbot.io"!= message.personEmail)){
        email = message.personEmail;
        spark.createMessage(message.roomId, message100, { "markdown":true }, function(err, message) {
          if (err) {
            console.log("7WARNING: could not post Mention message to room: " + trigger.data.roomId);
            return;
          }
        });
      }

      if(command){
        switch (command.keyword) {
          //state 100 ==> 000
          case "1":{
            currentState = 000;
            spark.createMessage(message.roomId, message000, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("8WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            break;
          }
          default:{
            spark.createMessage(message.roomId, message100, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("9WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
          }
        }
      }
      break;
    }
    //suivi de colis
    case 200:{
      //state 200 ==> 200
      if((!command) && ("BotPostalTest@sparkbot.io"!= message.personEmail)){
        spark.createMessage(message.roomId, message200, { "markdown":true }, function(err, message) {
          if (err) {
            console.log("10WARNING: could not post Mention message to room: " + trigger.data.roomId);
            return;
          }
        });
      }
      if(command){
        switch (command.keyword) {
          //state 200 ==> 200 api pour suivi
          case "suivi":{
            var nb = command.args[0];
            var option1 = {
              method: 'GET',
              url: 'https://api.laposte.fr/suivi/v1/'+nb,
              headers:
              { 'cache-control': 'no-cache',
              'content-type': 'application/json',
              'x-okapi-key': 'zchl9IRQIeGObF+kw+s4nD4h+d6pJKqgGMwJtT7KFJs/sGa4p1ljEh8hU1zwNcaV' }
            };

            request(option1, function (error, response, body) {
              if (error) throw new Error(error);
              console.log(body);
              spark.createMessage(command.message.roomId, "state:"+JSON.parse(body).message, { "markdown":true }, function(err, response) {
                if (err) {
                  console.log("11WARNING: could not post Fallback message to room: " + command.message.roomId);
                  return;
                }
              });
            });
            break;
          }
          //state 200 ==> 200 information
          case "2":{
            spark.createMessage(message.roomId, message220, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("12WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            break;
          }
          //state 200 ==> 000 retour à la liste de service
          case "3":{
            currentState = 000;
            spark.createMessage(message.roomId, message000, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("13WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            break;
          }
          //state 200 ==> 200
          default:{
            spark.createMessage(message.roomId, message200, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("14WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
          }
        }
      }
      break;
    }
    case 300:{
      //state 300 ==> 300
      if((!command) && ("BotPostalTest@sparkbot.io"!= message.personEmail)){
        spark.createMessage(message.roomId, message300, { "markdown":true }, function(err, message) {
          if (err) {
            console.log("10WARNING: could not post Mention message to room: " + trigger.data.roomId);
            return;
          }
        });
      }
      if(command){
        switch (command.keyword) {
          //state 300 ==> 300 api pour suivi
          case "adresse":{
            var adresse = command.args.join(" ");
            var option2 = {
              method: 'GET',
              url: 'http://api-adresse.data.gouv.fr/search/?q='+adresse
            };

            request(option2, function (error, response, body) {
              if (error) throw new Error(error);
              var i,resultset;
              var resultmessage="";
              for (i in resultset=JSON.parse(body).features){
                resultmessage += resultset[i].properties.postcode +" "+ resultset[i].properties.city+"<br/>"
                //console.log(JSON.parse(i.properties).postcode + JSON.parse(i.properties).city);
              }
              spark.createMessage(command.message.roomId, resultmessage+"<br/>Si vous ne trouvez pas, entrez une adresse plus précise.", { "markdown":true }, function(err, response) {
                if (err) {
                  console.log("11WARNING: could not post Fallback message to room: " + command.message.roomId);
                  return;
                }
              });
            });
            break;
          }
          //state 300 ==> 300 information
          case "2":{
            spark.createMessage(message.roomId, message320, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("12WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            break;
          }
          //state 300 ==> 000 retour à la liste de service
          case "3":{
            currentState = 000;
            spark.createMessage(message.roomId, message000, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("13WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
            break;
          }
          //state 300 ==> 300
          default:{
            spark.createMessage(message.roomId, message200, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("14WARNING: could not post Mention message to room: " + trigger.data.roomId);
                return;
              }
            });
          }
        }
      }
      break;
    }
    case 400:{
      break;
    }
    default:{
      if((!command) && ("BotPostalTest@sparkbot.io"!= message.personEmail)){
        spark.createMessage(message.roomId, message000, { "markdown":true }, function(err, message) {
          if (err) {
            console.log("15WARNING: could not post Mention message to room: " + trigger.data.roomId);
            return;
          }
        });
        currentState = 000;
      }
    }
  }


});

//first added into a room or a conversation
bot.onEvent("memberships", "created", function (trigger) {
  var newMembership = trigger.data; // see specs here: https://developer.ciscospark.com/endpoint-memberships-get.html
  if (newMembership.personId != bot.interpreter.person.id) {
    console.log("new membership fired, but it is not us being added to a room. Ignoring...");
    return;
  }

  console.log("bot's just added to room: " + trigger.data.roomId);

  spark.createMessage(trigger.data.roomId, "Bonjour \n ", { "markdown":true }, function(err, message) {
    if (err) {
      console.log("WARNING: could not post Hello message to room: " + trigger.data.roomId);
      return;
    }

    if (message.roomType == "group") {
      spark.createMessage(trigger.data.roomId, "Type /info pour information", { "markdown":true }, function(err, message) {
        if (err) {
          console.log("WARNING: could not post Mention message to room: " + trigger.data.roomId);
          return;
        }
      });
    }
  });
});

//les messages
var message000 = "liste de service (Tapez /+numéro pour choisir)<br/>1.Saluer<br/>2.Suivi votre coli<br/>3.Recherche code postal<br/>4.Information de ce bot";
var messageInfoBot = "C'est un bot pour tester";
var message100 = "Bonjour <@personEmail:" + email + "><br/>Tapez /1 pour retourner à la liste de service";
var message200 = "1.Tapez /suivi NUMERO_DE_SUIVI <br/> 2. Aide <br/> 3. Retourez à la liste de service";
var message220 = "Le numéro de suivi doit être 13 caractères <br/>Exemple: /suivi 6w00581498890";
var message300 = "1.Tapez /adresse VOTRE_ADRESSE <br/> 2. Aide <br/> 3. Retourez à la liste de service";
var message320 = "Exemple: /adresse 11, Rue Camille Desmoulins";
