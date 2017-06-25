const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Realtime database triger child="ntb" : ("notification_topic_box")
//  Fetch messaging token from account by(subscrible = enable) 
//  Account nust have "messaging_token"
//  Loop send notification 
exports.sendTopicNotification = functions.database.ref("/ntb")
  .onWrite(event => {
    var data = event.data.val();     

    //  Fetch messaging token from account by subscrible=enable
    FetchSubscrible(function(account){
        for(var key in data){
            //  delete notification  topic in topic box before read data to memory
            admin.database().ref("/ntb/" + key).remove();

            //  Setup payload from messaging (notification)
            var value = data[key];
            var payload = {
                "notification" :{
                    "title": value.title,
                    "body": value.body,
                    "icon": value.icon,
                    "click_action": value.url
                }
            };

            //  Loop send messaging to device
            for(var accountKey in account){
                var registrationToken = account[accountKey].messaging_token;
                if(registrationToken){
                    SendMessaging(payload, registrationToken, "/ntbtest/" + key + "/" + accountKey);
                }
            }
            
        }
    });

}); 


//  test function
function TempData(reference , data){
    for(var key in data){
        // write data temp
        admin.database().ref(reference).set(data[key].messaging_token);
    }
}


//  Private function
//  Read notification subacrible is enable
function FetchSubscrible(success){
  var ref = admin.database().ref("/account");
  ref.orderByChild("subscrible").equalTo("enable").once("value", function(data) {
    success(data.val());
  });
}

//  Send message to device function 
function SendMessaging(payload, registrationToken, messagingKey){
  admin.messaging().sendToDevice(registrationToken, payload)
    .then(function(response) {
      admin.database().ref(messagingKey).set("true");     
    })
    .catch(function(error) {
      admin.database().ref(messagingKey).set("false");              
    });
}
