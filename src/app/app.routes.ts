import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './Dashboard/dashboard';
import { ForgotPassword } from './forgot-password/forgot-password';

import { authGuard } from './auth-guard';

export const routes: Routes = [

  {
    path: '',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'forgot-password',
    component: ForgotPassword
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];