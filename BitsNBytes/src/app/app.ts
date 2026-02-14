import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/components/navbar/navbar";
import { ImageSelector } from './shared/components/image-selector/image-selector';
import { AuthService } from './features/auth/services/auth-service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ImageSelector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  ngOnInit() {
    console.log('API URL:', environment.apiBaseUrl);
    console.log('Production mode:', environment.production);
  }
  protected readonly title = signal('BitsNBytes');
  authService = inject(AuthService);
  loadUserRef = this.authService.loadUser();
  user = this.loadUserRef.value;

  effectRef = effect(() => {
    const userValue = this.user();
    if (userValue) {
      this.authService.setUser(userValue);
    }
  });
}

