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
//  Loop send notification 
exports.sendTopicNotification = functions.database.ref("/ntb")
  .onWrite(event => {
    var data = event.data.val();     

    //  Fetch messaging token from account by subscrible=enable
    FetchSubscrible(function(account){
        for(var key in data){
            //  delete notification  topic in topic box
            admin.database().ref("/ntb/" + key).remove();
            TempData("/ntbtemp/" + key, account);
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

