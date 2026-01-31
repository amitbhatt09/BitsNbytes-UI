import { inject } from '@angular/core/primitives/di';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();
  if(!user){
    //navigate back to login
    router.navigate(['/login']);
    return false;
  }
  
  //user is logged  in

  //check role of user
  const isWriter = user.roles.includes("writer");
  if(!isWriter){
    //navigate back to home
    authService.onLogout();
    return false;
  }
  //we know user is logged n and writer role
  return true;
};
