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

//cread time and date : 2017-07-06T09:21:48.859Z
//entered time and date :2017-07-05T02%3A01
//variable pour enregistrer les rooms
// roomid, demandeQueue,serviceQueue
var availability=[
  {"personid":"Y2lzY29zcGFyazovL3VzL1BFT1BMRS9iMTkyNzg4ZC0yMzllLTQ4YTgtYWU1Yi0wMmNhNjllYzhiOTQ",
    "personemail":"yingqi.z2017@gmail.com",
    "services":["00","01","02","03"],
    "status":"ready"
  }
];

//callbackWaitingList [{"sujet":sujet,"info": info}]
var callbackList=[];
//finit state machine
bot.onMessage(function(trigger,message){
  console.log("new message from: " + trigger.data.personEmail + ", text: " + message.text);
  var command = bot.asCommand(message);
  if (command) {
    switch (command.keyword) {
      //message from bot MSAP
      case "demand":
        var demandesujet = command.args[0];
        var r2 = command.args[1];
        var e = message.personEmail;
        var response = match(demandesujet,r2);
        if (""!= response) {
          var text = "<@personEmail:"+e+"> /available "+response+" "+r2;
          spark.createMessage(e, text, { "markdown":true }, messageCallback(err, message));
        }else{
          var text = "<@personEmail:"+e+"> /unavailable "+r2;
          spark.createMessage(e, text, { "markdown":true }, messageCallback(err, message));
        }
        console.log(availability);
        break;
      case "callback":
        var sujet = command.args[0];
        //@
        var info = command.args[1];
        callbackWaitingList.push({"sujet":sujet,"info":info});
        //dealwithCallback();
        break;
      case "finish":
        var r = command.args[0];
        changeStatus(r);
        console.log(availability);
        break;
      //message from web dispo
      case "deleteSchedule":

        break;
      case "addSchedule":

        break;
      default:
    }

  }
});

//gestion de service type: e :return email, i, return id
function match(sujet,roomoccupe){
  var res = "";
  for (var i = 0; i < availability.length; i++) {
    if (availability[i].status){
      for (x in availability[i].services){
        if (sujet == availability[i].services[x]){
          availability[i].status = false;
          availability[i].occupe = roomoccupe;
          return res=availability[i].personemail;
        }
      }
    }
  }
  return res;
}

function changeStatus(room){
  for (var i = 0; i < availability.length; i++) {
    if ((room==availability[i].status)||(email==availability[i].status) ){
      availability[i].status = true;
      availability[i].occupe = "";
    }
  }
}

function dealwithCallback(){
  for (var i = 0; i < callbackWaitingList.length; i++) {
    var tempSujet = callbackWaitingList[i].sujet;
    var tempOccup = callbackWaitingList[i].email;
    for (var i = 0; i < availability.length; i++) {
      if (availability[i].status){
        for (x in availability[i].services){
          if (tempSujet == availability[i].services[x]){
            availability[i].status = tempOccup;
            callbackWaitingList.splice(i,1);
            spark.createMessage(availability[i].roomid, tempOccup, { "markdown":true }, messageCallback(err, message));
            return;
          }
        }
      }
    }
  }
}

function messageCallback(err, message){
  if (err) {
    console.log("WARNING: could not post Mention message to room: " + r1);
    return;
  }
}
