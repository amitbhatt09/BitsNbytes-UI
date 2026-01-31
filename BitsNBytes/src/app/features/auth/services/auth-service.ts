import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../login/models/auth.model';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource, HttpResourceRef, HttpResourceRequest } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  user = signal<User | null>(null);
  router = inject(Router);

  loadUser():HttpResourceRef<User | undefined>{
    return httpResource(()=>{
      const request : HttpResourceRequest = {
        url:`${environment.apiBaseUrl}/api/auth/me`,
        withCredentials:true
      }
      return request;
    })
  }
  login(email: string, password: string):Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, { email:email, password:password },{
      withCredentials: true
    }).pipe(tap((userResponse) => {
      this.setUser(userResponse);
    }));
  }

  register(email: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/auth/register`, { email, password }, {
      withCredentials: true
    });
  }

  onLogout(){
    return this.http.post<void>(`${environment.apiBaseUrl}/api/auth/logout`, {}, {
      withCredentials: true
    }).subscribe({
      next: () => {
        //clear out the user signal
        this.setUser(null);

        //redirect the user to home page
        this.router.navigate(['']);
      }
    })
    };

    setUser(updatedUser:User | null){
      if(updatedUser){
        this.user.set({
          email: updatedUser.email,
          roles: updatedUser.roles.map(r=>r.toLocaleLowerCase()) 
        });
      }else{
        this.user.set(null);
      }
    }
  }

