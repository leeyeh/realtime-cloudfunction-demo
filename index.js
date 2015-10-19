var AV = require('leanengine');
var AVRT = require('leancloud-realtime');

var appId = process.env.LC_APP_ID;
var appKey = process.env.LC_APP_KEY;

AV.initialize(appId, appKey, process.env.LC_APP_MASTER_KEY);
AV.Cloud.define('chatcreate', function(request, response) {
  var currUserId = request.params.username;
  console.log(currUserId);
  var chatName = request.params.chatname;
  //创建实时通信实例
  var rtObj = AVRT({
    appId: appId,
    clientId: currUserId,
    encodeHTML: true
  });
  rtObj.on('open', function() {
    //looks like it never reaches here
    console.log('connected.');
    rtObj.conv({
      members: [
        'LeanCloud', currUserId
      ]
    }, function() {
      console.log('new conv created.');
      response.success('new conv created');
      rtObj.close();
    });
  });
  rtObj.on('close', function(e) {
    console.log('closed', e);
  });
  rtObj.on('reuse', function() {
    console.log('reuse');
  });
});

var app = require('express')();
app.use(AV.Cloud);
var PORT = parseInt(process.env.LC_APP_PORT || 3000);
app.listen(PORT, function() {
  console.log('Node app is running, port:', PORT);
});

module.exports = AV.Cloud;
