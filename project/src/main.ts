import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { appConfig } from './app/app.config';
import { NavbarComponent } from './app/shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from './app/shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-loading-spinner></app-loading-spinner>
  `
})
export class App {}

// 🔐 Force logout on app load
localStorage.removeItem('currentUser');

bootstrapApplication(App, appConfig);