import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ExportService {

  constructor(
    public readonly http: HttpClient
  ) {
  }
  print(url: string, params?: any):Observable<any>{
    return this.http.get( url,{ observe: 'response',params, responseType: 'blob'})
  }
}
