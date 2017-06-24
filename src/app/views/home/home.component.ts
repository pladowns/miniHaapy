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
  constructor() {this.firebase = new Firebase();}

  ngOnInit() {
    const userId = this.firebase.userAuthen;
    const user = this.firebase.userAuthen.providerData[0];

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
      $("#userprofile-provider > a").attr("href", "https://www.twitter.com/" + user.uid);
        break;
    }

    $("#userprofile-photo >  img").attr("src", user.photoURL);
    $("#userprofile-name > label").html(user.displayName);
    $("#userprofile-provider > a").html("@" + user.providerId);
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
    this.firebase.SendRegistrationToServer(function(){
      //console.log("Subscrible success.");
    }, function(err){
      //console.log("Subscrible failed.");
    });
  }

  Unsubscrible(){
    this.firebase.SendUnRegistrationToServer(function(){
      //console.log("Unsubscrible success.");
    },function(err){
      //console.log("Unsubscrible failed.");
    });
  }
    
}
