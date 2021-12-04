import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppInterface } from './app.interface';

@Injectable({providedIn:'root'})
export class AppService {
  constructor(
    private readonly http:HttpClient
  ) {
  }
  getAll(): Observable<AppInterface[]>{
    return this.http.get<AppInterface[]>('application')
  }
}
