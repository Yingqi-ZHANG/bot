
var request = require("request");
var SparkBot = require("node-sparkbot");
var bot = new SparkBot();
var fs = require('fs');
// var { URL } = require('url');
// fs.readFileSync(fileUrl);
//bot.interpreter.prefix = "#"; // Remove comment to overlad default / prefix to identify bot commands

var SparkAPIWrapper = require("node-sparkclient");
if (!process.env.SPARK_TOKEN) {
  console.log("Could not start as this bot requires a Cisco Spark API access token.");
  process.exit(1);
}
var spark = new SparkAPIWrapper(process.env.SPARK_TOKEN);

var request = require("request");

var filename="";
bot.onMessage(function(trigger,message){
  console.log("new message from: " + trigger.data.personEmail + ", text: " + message.text);
  if (0!=(message.files.length)){
    console.log(message.files);
    var filesurls = message.files
    for (var i=0;i < filesurls.length;i++) {
      var options = { method: 'GET',
        url: filesurls[i],
        headers:{
          'cache-control': 'no-cache',
          authorization: 'Bearer '+process.env.SPARK_TOKEN
        }
      };
      downloadfile(options,i)
    }

  }
});

function downloadfile(options,i){
  request(options,function(error,response,body){
    if(error){
      console.log(error);
    }
  })
  .on('response',function(response){
    //console.log(response);
    filename = response.headers['content-disposition'].split("\"")[1];
    fs.rename("temp"+i,filename,function(err){
      if (err) {
        console.log(err);
      }
    });
  })
  .pipe(fs.createWriteStream("temp"+i));
}
