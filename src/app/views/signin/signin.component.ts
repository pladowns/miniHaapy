import { Component } from '@angular/core';
import {Firebase, FirebaseAuthProvider} from './../../class/firebase';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent {
  private _provider;
  private _scope;
  constructor() { }

  SigninGoogle(){
    this._provider = FirebaseAuthProvider.Google;
    this._scope = 'https://www.googleapis.com/auth/plus.login';
  return this.Signin();
  }

  SigninFacebook(){
    this._provider = FirebaseAuthProvider.Facebook;
    this._scope = 'public_profile, email';
    return this.Signin();
  }

  SigninTwitter(){
    this._provider = FirebaseAuthProvider.Twitter;
    this._scope = '';
    return this.Signin();
  }

  private Signin(){
    let firebase = new Firebase();
    firebase.AuthProvider(this._provider);
    firebase.AuthScope(this._scope);
    let user = firebase.Signin();
    if(user){
      return user;
    }else{
      return null;
    }
  }

}