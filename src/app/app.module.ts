import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from '@angular/common';

import {AppRouteConfig} from './app.route';
import {Firebase} from './class/firebase';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { SigninComponent } from './views/signin/signin.component';
import { WaitComponent } from './views/wait/wait.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    WaitComponent
    
  ],
  imports: [
    BrowserModule,
    AppRouteConfig,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    Firebase
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

