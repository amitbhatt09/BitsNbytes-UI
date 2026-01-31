import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../features/auth/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);
  router = inject(Router);

  // true when the current route is exactly the home page
  get isHome(): boolean {
    return this.router.url === '/';
  }

  onLogout() {
    this.authService.onLogout();
  }
}
