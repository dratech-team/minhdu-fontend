import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {
  }
  signUp(username: string, password: string , app: string, role: string, employeeId?: number ): Observable<any> {

    return this.http.post<any>(
      'auth/signup',
      {
        username,
        password,
        role,
        app,
        employeeId
      });
  }

  signIn(username: string, password: string , app: string): Observable<any> {
    return this.http.post<any>(
      'auth/signin',
      {
        username,
        password,
        app
      });
  }
}
