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


    for(var key in data){
        //  delete notification  topic in topic box
        admin.database().ref("/ntb/" + key).remove();
        admin.database().ref("/ntbtemp/" + key).set(data[key]);
    }
     

}); 