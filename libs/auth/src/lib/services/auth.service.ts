import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {
  }

  signUp(body: any): Observable<any> {
    return this.http.post<any>('auth/signup', body);
  }

  signIn(username: string, password: string, app: string): Observable<any> {
    return this.http.post<any>('auth/signin', { username, password, app });
  }

  updateAccount(body: any): Observable<any> {
    return this.http.patch<any>('auth/signup', body);
  }
}
