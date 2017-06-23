// ==============================================================
//  Router Config
import {Routes, RouterModule} from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { SigninComponent } from './views/signin/signin.component';
import { WaitComponent } from './views/wait/wait.component';

const router:Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path:'signin',
        component: SigninComponent
    },
    {
        path:'wait',
        component: WaitComponent
    },    
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    },
]

export const AppRouteConfig = RouterModule.forRoot(router);
