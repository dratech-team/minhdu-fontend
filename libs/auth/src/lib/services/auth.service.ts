import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>('auth/signin', { username, password });
  }
}
