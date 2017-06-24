import { Component, OnInit } from '@angular/core';
import {Firebase} from './../../class/firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private firebase;
  constructor() {this.firebase = new Firebase();}

  ngOnInit() {
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
