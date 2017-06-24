import { Component, OnInit } from '@angular/core';
import {Firebase} from './../../class/firebase';
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private firebase;
  constructor() {
    this.firebase = new Firebase();
  }

  ngOnInit() {

  }

  Update(){
    const userId = this.firebase.userAuthen;
    const user = this.firebase.userAuthen.providerData;
    switch(user.providerId){
      case 'google.com' :
        $(".userprofile").addClass("google");
      $("#userprofile-provider > a").attr("href", "https://plus.google.com/" + user.uid);
        break;
      case 'facebook.com' :
        $(".userprofile").addClass("facebook");
      $("#userprofile-provider > a").attr("href", "https://www.facebook.com/" + user.uid);
        break;
      case 'twitter.com' :
        $(".userprofile").addClass("twitter");
      $("#userprofile-provider > a").attr("href", "https://twitter.com/intent/user?user_id=" + user.uid);
        break;
    }

    $("#userprofile-photo >  img").attr("src", user.photoURL);
    $("#userprofile-name > label").html(user.displayName);
    $("#userprofile-provider > a").html("@" + user.providerId);

    const subscrible = user.subscrible;
    if(subscrible){
      if(subscrible == 'enable') {
        $("#menu-subscrible-check > div").removeClass("fa-toggle-off").addClass("fa-toggle-on");
      }else{
        $("#menu-subscrible-check > div").removeClass("fa-toggle-on").addClass("fa-toggle-off");
      } 
    }

    const notification = user.notification;
    if(notification){
      if(notification == 'enable') {
        $("#menu-notification-check > div").removeClass("fa-toggle-off").addClass("fa-toggle-on");
      }else{
        $("#menu-notification-check > div").removeClass("fa-toggle-on").addClass("fa-toggle-off");
      } 
    }    

    console.log(user);
  }

  Signout(){
    this.firebase.Signout(function(resault){
      if(resault){
        console.log('Signin out success');
      }else{
        console.log('Signin out Fialed');
      }
    });
  }


  Subscrible(){
    const self = this;

    const userId = this.firebase.userAuthen;
    const user = this.firebase.userAuthen.providerData;

    if(user.subscrible == 'enable') {
      this.firebase.SendUnRegistrationToServer("subscrible", function(){
        console.log("Unsubscrible success.");
        self.ReLoadUser();
      },function(err){
        console.log("Unsubscrible failed.");
        console.log(err);
      });
    }else{
      this.firebase.SendRegistrationToServer("subscrible", function(){
        console.log("Subscrible success.");
        self.ReLoadUser();
      }, function(err){
        console.log("Unsubscrible failed.");
        console.log(err);
      });
    } 

  }

  Notification(){

    const self = this;

    const userId = this.firebase.userAuthen;
    const user = this.firebase.userAuthen.providerData;

    if(user.notification == 'enable') {
      this.firebase.SendUnRegistrationToServer("notification", function(){
        console.log("UnNotification success.");
        self.ReLoadUser();
      },function(err){
        console.log("UnNotification failed.");
        console.log(err);
      });
    }else{
      this.firebase.SendRegistrationToServer("notification", function(){
        console.log("Notification success.");
        self.ReLoadUser();
      }, function(err){
        console.log("Notification failed.");
        console.log(err);
      });
    } 
  }
    
ReLoadUser(){
  const self = this;
  this.firebase.InitUser(function(){
      self.Update();
  })
}

HideMenu(){
  $(".side").removeClass("show").addClass("hide");
}

ShowMenu(){
  $(".side").removeClass("hide").addClass("show");
}

WindowsResize(width){
  if(width > 950){
    $(".side").removeClass("hide").removeClass("show");
  }
}

}
