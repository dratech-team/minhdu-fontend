import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../apps/hr/src/environments/environment';

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
    console.log('service', username, password);
    return this.http.post<any>(
      'auth/signin',
      {
        username,
        password,
        app
      });
  }
}
