import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class AppService {
  constructor(
    private readonly http:HttpClient
  ) {
  }
  getAll(): Observable<any[]>{
    return this.http.get<any>('application')
  }
}
