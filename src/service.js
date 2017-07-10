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


//variable pour enregistrer les rooms
// roomid, demandeQueue,serviceQueue
const botservice=[
  {"id":"03","name":"Test","email":"gmaildomainetest@sparkbot.io","roomid":"Y2lzY29zcGFyazovL3VzL1JPT00vMmMwNDU3NzAtNGNmNS0xMWU3LTlkNTgtYTkwYTljMjEyNDNl"}
];

//var spark = new SparkAPIWrapper("NTRhMmRlMWYtZGZlOS00YmQ2LTk4YzgtMDhhMDMxZDRmNTg3YzJlMzY3NjgtMjU4");
//finit state machine
bot.onMessage(function(trigger,message){
  console.log();
  console.log("new message from: " + trigger.data.personEmail + ", text: " + message.text);
  console.log(message);
  console.log();

  // var currentRoom = getRoomIndex(message.roomId);
  // if((-1)== currentRoom){
  //   currentRoom = rooms.demandeQueue.push(new room(currentRoom)) - 1 ;
  // }
  var command = bot.asCommand(message);
  if (command) {
    switch (command.keyword) {
      //command from user
      case "demand":
        var serviceL1 = command.args[0];
        var serviceL2 = command.args[1];
        //var r1 = getBotRoom(serviceL1);
        var e = getBotEmail(serviceL1)
        var r2 = message.roomId;
        var text = "<@personEmail:"+e+"> /demand "+serviceL2+" "+r2;
        spark.createMessage(e, text, { "markdown":true }, messageCallback(err, message));
        break;
      case "callback":
        var serviceL1 = command.args[0];
        var serviceL2 = command.args[1];
        //var r1 = getBotRoom(serviceL1);
        var e = getBotEmail(serviceL1)
        //notfinished!!!
        console.log("@@@@@"+message.markdown);
        var info = message.markdown.substr(message.markdown.indexOf("Prénom"));
        //var text = "<@personEmail:"+e+"> /callback "+serviceL2+" "+info;
        var text = "/callback "+serviceL2+" "+info;
        spark.createMessage(e, text, { "markdown":true }, messageCallback(err, message));
        break;
      case "finish":
        var r2 = message.roomId;
        var e2 = message.personEmail;
        if (!(command.args.length == 0)) {
          var serviceL1 = command.args[0];
          //var r1 = getBotRoom(serviceL1);
          var e = getBotEmail(serviceL1)
          var text = "<@personEmail:"+e+"> /finish "+r2+" "+e2;
          spark.createMessage(e, text, { "markdown":true }, messageCallback(err, message));
        }
        spark.deleteRoom(r2, function(err, response) {
          if (!err)
          console.log(response.message)
        });
        break;
      //message from bot of a domaine
      case "available":
        var email = command.args[0];
        var r1 = command.args[1];
        spark.createMessage(r1, email, { "markdown":true }, messageCallback(err, message));
        break;
      case "unavailable":
        var r1 = command.args[0];
        spark.createMessage(r1, "unavailable", { "markdown":true }, messageCallback(err, message));
        break;
      default:
    }

  }
});


//bot.onEvent("memberships", "created", function (trigger) {
//gestion de service
function getBotRoom(serviceId){
  for (var i = 0; i < botservice.length; i++) {
    if (serviceId == botservice[i].id){
      return botservice[i].roomid;
    }
  }
}
function getBotEmail(serviceId){
  for (var i = 0; i < botservice.length; i++) {
    if (serviceId == botservice[i].id){
      return botservice[i].email;
    }
  }
}
function messageCallback(err, message){
  if (err) {
    console.log("WARNING: could not post Mention message to room: " + r1);
    return;
  }
}
