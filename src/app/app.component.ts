import { Component, OnInit } from '@angular/core';
import {Firebase} from './class/firebase';
import {Router, NavigationStart, RouterState} from '@angular/router'

import { HomeComponent } from './views/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private firebase = new Firebase();
  private home = new HomeComponent();
  constructor(private _router: Router) {
    const self = this;
    this._router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        let state = (event instanceof NavigationStart);
        if(event.url == '/signin'){
          if(self.firebase.userAuthen) this._router.navigate(['/']);
        }else if(event.url != '/wait'){
          if(!self.firebase.userAuthen) this._router.navigate(['/signin']);
        }
      }
    });  
  
  }

  ngOnInit() {
    let self = this;
    this._router.navigate(['/wait']);
    this.firebase.User(function(user){
      self.CheckAuthen();
    });    

    this.firebase.messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
      // ...
    });

  }

  private CheckAuthen(){
    let location = window.location.pathname;
    let user = this.firebase.userAuthen;
    const self = this;
    if(!user){
      this._router.navigate(['/signin']);
    }else{
      //  Update token on load web application
      this.firebase.InitUser(function(){
        self.home.Update();
      });
      if(location == '/signin') location = '/';
      this._router.navigate([location]); 
    }
  }

  // @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.home.WindowsResize(event.target.innerWidth);
  }

}
