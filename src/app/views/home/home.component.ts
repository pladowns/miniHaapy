import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Firebase} from './../../class/firebase';
import $ from 'jquery';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private firebase;
  constructor(private router: Router) {
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

    this.FriendMenu();
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

  MainMenu() {
    $(".mainview").removeClass("none");
    $(".questionview").addClass("none");
    $(".friendview").addClass("none");
    $(".title").html("หน้าหลัก");
  }

  QuestionMenu() {
    $(".mainview").addClass("none");
    $(".questionview").removeClass("none");
    $(".friendview").addClass("none");
    $(".title").html("ถามเพือ่น");
    this.FetchQuestList();
  }

  FriendMenu() {
    $(".mainview").addClass("none");
    $(".questionview").addClass("none");
    $(".friendview").removeClass("none");
    $(".title").html("เพื่อน");

    const self = this;
    $(".friend-new > input").keypress(function(){
      let input = $(".friend-new > input").val();
      if(input){
        self.firebase.FindFriend(input, function(data){
          self.PreviewFriend(data);
        });
      }else{
        $("#preview").remove();
      }
    });

    this.FetchFriendList();
  }

  PreviewFriend(data){
    const self = this;
      $("#preview").remove();
    if(data){
      $(".previewp").append("<div _ngcontent-c2 id='preview'></div>");
      $("#preview").append("<div _ngcontent-c2 class='fa fa-close preview-hide'></div>");
      for(var key in data){
        $("#preview").append("<div _ngcontent-c2 class='friend-item' id='item-" + key + "'></div>");
        const name = "#item-" + key;
        $(name).append("<div _ngcontent-c2><img _ngcontent-c2 src='"+ data[key].photoURL + "'></div>");
        $(name).append("<label _ngcontent-c2>" + data[key].displayName + "</label>");
        $(name).append("<label _ngcontent-c2>" + data[key].providerId + "</label>");

        $(name).click(function(){
          let uid = $(this).attr("id").split('-');;
          uid = uid[1];
          self.firebase.AddNewFriend(uid, data[uid], function(res){
            $("#preview").remove();

            $(".friend-list").prepend("<li _ngcontent-c2 class='friend-item-list' id='itemlist-" + uid + "'></li>");
            const name = "#itemlist-" + uid;
            $(name).append("<div _ngcontent-c2><img _ngcontent-c2 src='"+ data[uid].photoURL + "'></div>");
            $(name).append("<label _ngcontent-c2>" + data[uid].displayName + "</label>");
            $(name).append("<label _ngcontent-c2>" + data[uid].providerId + "</label>");  

          });

        });

      }

      $(".preview-hide").click(function(){
        $("#preview").remove();
      });

    }
  }

  AddNewQuest(){
    const input = $(".quest-new > input").val();
    if(input){
      // add new question
      this.firebase.AddNewQuestion(input, function(key){
        $(".quest-list").prepend("<li _ngcontent-c2><input _ngcontent-c2 type='checkbox' class='checkbox' id='" + key + "'><label _ngcontent-c2 for='" +  key + "''>" + input + "</label></li>");      
      },function(err){

      });
    }
  }

  FetchQuestList(){
      $(".quest-list").html("");
      this.firebase.FetchQuestionList(function(data){
        for(var key in data){
          $(".quest-list").append("<li _ngcontent-c2><input _ngcontent-c2 type='checkbox' class='checkbox' id='" + key + "'><label _ngcontent-c2 for='" +  key + "''>" + data[key] + "</label></li>");
        }
      },function(err){
        
      });
  }

  FetchFriendList(){
      $(".friend-list").html("");
      this.firebase.FetchFriendList(function(data){
        for(var key in data){
          $(".friend-list").append("<li _ngcontent-c2 class='friend-item-list' id='itemlist-" + key + "'></li>");
          const name = "#itemlist-" + key;
          $(name).append("<div _ngcontent-c2><img _ngcontent-c2 src='"+ data[key].photoURL + "'></div>");
          $(name).append("<label _ngcontent-c2>" + data[key].displayName + "</label>");
          $(name).append("<label _ngcontent-c2>" + data[key].providerId + "</label>");          
        }
        
      },function(err){
        
      });
  }

}
