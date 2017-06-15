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
var availability=[
  {"personid":"Y2lzY29zcGFyazovL3VzL1BFT1BMRS9iMTkyNzg4ZC0yMzllLTQ4YTgtYWU1Yi0wMmNhNjllYzhiOTQ",
    "personemail":"yingqi.z2017@gmail.com",
    "services":["00","01","02","03"],
    "status":"ready",
    "roomid":"Y2lzY29zcGFyazovL3VzL1JPT00vN2Y1OTlkMTAtNTExMi0xMWU3LWI4MDctNzFkZjg0MGY4NDhk"}
];
var botService={"email":"BotPostalTest@sparkbot.io","roomid":"Y2lzY29zcGFyazovL3VzL1JPT00vMmMwNDU3NzAtNGNmNS0xMWU3LTlkNTgtYTkwYTljMjEyNDNl"}

//callbackWaitingList [{"sujet":sujet,"email": e}]
var callbackWaitingList=[];
//var spark = new SparkAPIWrapper("NTRhMmRlMWYtZGZlOS00YmQ2LTk4YzgtMDhhMDMxZDRmNTg3YzJlMzY3NjgtMjU4");
//finit state machine
bot.onMessage(function(trigger,message){
  console.log("new message from: " + trigger.data.personEmail + ", text: " + message.text);
  var command = bot.asCommand(message);
  if (command) {
    switch (command.keyword) {
      case "demande":
        var demandesujet = command.args[0];
        var r2 = command.args[1];
        var r1 = message.roomId;
        var e = message.personEmail;
        var response = match(demandesujet,r2);
        if (""!= response) {
          var text = "<@personEmail:"+e+"> /available "+response+" "+r2;
          spark.createMessage(r1, text, { "markdown":true }, function(err, message) {
            if (err) {
              console.log("WARNING: could not post Mention message to room: " + r1);
              return;
            }
          });
        }else{
          var text = "<@personEmail:"+e+"> /unavailable "+r2;
          spark.createMessage(r1, text, { "markdown":true }, function(err, message) {
            if (err) {
              console.log("WARNING: could not post Mention message to room: " + r1);
              return;
            }
          });
        }
        console.log(availability);
        break;
      case "callback":
        var sujet = command.args[0];
        var e = command.args[1];
        callbackWaitingList.push({"sujet":sujet,"email":e});
        console.log(callbackWaitingList);
        dealwithCallback();
        break;
      case "finish":
        var r = command.args[0];
        var e = command.args[1];
        changeStatus(r,e);
        dealwithCallback();
        console.log(availability);
        break;
      default:
    }

  }
});

//gestion de service type: e :return email, i, return id
function match(sujet,roomoccupe){
  var res = "";
  for (var i = 0; i < availability.length; i++) {
    if ("ready"==availability[i].status){
      for (x in availability[i].services){
        if (sujet == availability[i].services[x]){
          availability[i].status = roomoccupe;
          return res=availability[i].personemail;
        }
      }
    }
  }
  return res;
}

function dealwithCallback(){
  for (var i = 0; i < callbackWaitingList.length; i++) {
    var tempSujet = callbackWaitingList[i].sujet;
    var tempOccup = callbackWaitingList[i].email;
    for (var i = 0; i < availability.length; i++) {
      if ("ready"==availability[i].status){
        for (x in availability[i].services){
          if (tempSujet == availability[i].services[x]){
            availability[i].status = tempOccup;
            callbackWaitingList.splice(i,1);
            spark.createMessage(availability[i].roomid, tempOccup, { "markdown":true }, function(err, message) {
              if (err) {
                console.log("WARNING: could not post Mention message to room: " + r1);
                return;
              }
            });
            return;
          }
        }
      }
    }
  }
}


function changeStatus(room,email){
  for (var i = 0; i < availability.length; i++) {
    if ((room==availability[i].status)||(email==availability[i].status) ){
      availability[i].status = "ready";
    }
  }
  for (var i = 0; i < callbackWaitingList.length; i++) {
    if (email==callbackWaitingList[i].email ){
      callbackWaitingList.splice(i,1);
    }
  }
}

function init(){
  for (var i = 0; i < availability.length; i++) {
    if ( undefined ==availability[i].roomid){
      spark.createRoom("callback",function(err,room){
        if (!err) {
          availability[i].roomid = room.id;
          spark.createMembership(room.id,availability[i].emailfalse, function(err, response) {
            if (!err){console.log("warning:could not add people into a room");}
          });
        }else{
          console.log("warning:could not create a room");
        }
      });
    }
  }
}
