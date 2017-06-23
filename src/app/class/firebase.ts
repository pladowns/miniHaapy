import * as Firebasejs from 'firebase';
import {FirebaseConfig} from './../app.config';

export const enum FirebaseAuthProvider{
  Google,
  Facebook,
  Twitter
}

export class Firebase {
  public static object;
  
  public userAuthen;
  public messaging;
  private messagingToken: string;

  private database;

  private _provider;
  private _scope;

  private _projectKey;
  private _messagingSenderId;

  constructor() {
    if(Firebase.object){
      console.log("Firebase instance object");
      return Firebase.object
    }else{
      console.log("Firebase new instance");
      this.userAuthen = null;
      this._projectKey = FirebaseConfig.projectId;
      this._messagingSenderId = FirebaseConfig.messagingSenderId;
      Firebasejs.initializeApp(FirebaseConfig);     
      this.messaging = Firebasejs.messaging();    
      this.database = Firebasejs.database();
      Firebase.object = this;
    }
  }

  AuthProvider(provider: FirebaseAuthProvider){
      this._provider = null;
    switch(provider){
      case FirebaseAuthProvider.Google :
        this._provider = new Firebasejs.auth.GoogleAuthProvider();
        break;
      case FirebaseAuthProvider.Facebook :
        this._provider = new Firebasejs.auth.FacebookAuthProvider();
        break;
      case FirebaseAuthProvider.Twitter :
        this._provider = new Firebasejs.auth.TwitterAuthProvider();
        break;
      default :
        this._provider = new Firebasejs.auth.GoogleAuthProvider();
    }
  }

  AuthScope(scope){
      this._scope = scope;
  }

  User(callback){
    const self = this;
    Firebasejs.auth().onAuthStateChanged(function(user) {
        if(user){
          self.userAuthen = {
            uid: user.uid,
            providerData: user.providerData
          }
         callback(self.userAuthen);
        }else{
          self.userAuthen = null;
          callback(self.userAuthen);
        }
    });

  }

  Signin(){
    Firebasejs.auth().signInWithRedirect(this._provider);
    Firebasejs.auth().getRedirectResult().then(function(authData) {
        return true;
    }).catch(function(error) {
        return false;
    });  
    
  }

  Signout(callback){
    Firebasejs.auth().signOut().then(function() {
      callback(true);
    }, function(error) {
      callback(false);
    });
  }


  InitUser(){
    const self = this;
    this.database.ref("/account").orderByKey().equalTo(this.userAuthen.uid).once("value", function(data) {
      const user = data.val();
      if(user == null){
        const uid = self.userAuthen.uid;
        self.userAuthen.providerData = self.userAuthen.providerData[0];
        self.userAuthen.providerData["subscrible"] = "disable";
        self.userAuthen.providerData["notification"] = "enable";
        self.database.ref("/account/" + uid).set(self.userAuthen.providerData)
          .then(function(){
              self.InitMessaging();
          });
      }else{
          self.InitMessaging();
      }
    });
  }

  private InitMessaging(){
    const self = this;
    this.RequestMessagingPermission(function(){
      self.GetMessagingToken(function(token){
        // Get token success.
          // set messaging token
          let reference: string = "account/" + self.userAuthen.uid + "/messaging_token";
          self.addTokenToDatabase(reference, self.messagingToken, function(){
              console.log("Uodate messaging token success.");
          },function(err){
              console.log("Uodate messaging token failed.");
          });        
        //  Monitor Refresh messaging token
        self.MessagingTokenRefresh();     
      },function(err){
        //  Get token failed.
      });
    },function(err){
      //  Permission Failed.
    });
  }

  // ============== Database
  SendRegistrationToServer(successSebd, errorSend){
    const uid = this.userAuthen.uid;
    const self = this;
    this.RequestMessagingPermission(function(){
      self.GetMessagingToken(function(token){
        // set messaging token
        let reference: string = "account/"+ uid + "/subscrible";
        self.addTokenToDatabase(reference, "enable", function(){
          console.log("Subscrile success.");
          successSebd();
        },function(err){
          console.log("Subscrile failed.");
          errorSend(err)
        });
        //  console.log("old token : " + self.messagingToken);
      },function(err){
        errorSend(err);
      });
    },function(err){
      errorSend(err);
    });
  }

  SendUnRegistrationToServer(successSebd, errorSend){
    if(this.messagingToken){
      let reference: string = "account/" + this.userAuthen.uid + "/subscrible";
      this.addTokenToDatabase(reference, "disable", function(){
        console.log("Unsubscrile success.");
        successSebd();
        },function(err){
        console.log("Unsubscrile failed.");
        errorSend(err);
      });
    }else{
      console.log("Unsubscrile failed.");
      errorSend(false);
    }
  }

  private addTokenToDatabase(document, data, successInsert, errorInsert){
    this.database.ref(document).set(data)
    .then(function(){
      successInsert();
    })
    .catch(function(err){
      errorInsert(err);
    });
  }

  // ============== Messaging FCM
  private MessagingTokenRefresh(){
    const self = this;
    console.log("Monitor Refresh messaging token");
    this.messaging.onTokenRefresh(function() {
      console.log("On Token Refresh");
      self.RequestMessagingPermission(function(){
        self.GetMessagingToken(function(token){
          // set messaging token
          let reference: string = "messaging_token/" + self.userAuthen.uid + "/messaging_token";
          self.addTokenToDatabase(reference, self.messagingToken, function(){
              console.log("Uodate messaging token success.");
          },function(err){
              console.log("Uodate messaging token failed.");
          });
          //  console.log("New token : " + self.messagingToken);
          //  monitor messagin token refresh
        },function(err){
              console.log("Get  messaging token on Refresh failed.");
        });
      },function(err){
              console.log("Get  permission on Refresh failed.");
      });
    });
  }

  private RequestMessagingPermission(successRequest, errorRequest){
    this.messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      successRequest();
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.');
      errorRequest(err);
    });
  }

  private GetMessagingToken(successGetToken, errorGetToken){
    const self = this;
    this.messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        console.log("Get messaging token success.");
        self.messagingToken = currentToken;
        successGetToken(self.messagingToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        errorGetToken(false);
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ');
        errorGetToken(err);
    });
  }

}
