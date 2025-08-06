import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/gurards/auth.interceptor';
import { LOCALE_ID } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(App, {
  providers: [
     provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(appRoutes)  // aqui configura as rotas com provideRouter
  ]
}).catch(err => console.error(err));
