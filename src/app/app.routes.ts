import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import LoginComponent from './login/login';
import { authGuard } from './gurards/auth.guard';

export const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  // outras rotas protegidas aqui:
  // { path: 'outra-rota', component: OutraComponente, canActivate: [authGuard] },
  
  { path: 'login', component: LoginComponent },  // rota pública

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
