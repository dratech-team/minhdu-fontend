import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';


@Injectable({providedIn:'root'})
export class MaintainService {
  constructor(
    public readonly http: HttpClient,
  ) {
  }
  getMaintain(): Observable<any> {
    return this.http.get<any>(Api.MAINTAIN);
  }
  postMaintain(body: any): Observable<any> {
    return this.http.patch<any>(Api.MAINTAIN + `/${body.id}` , body);
  }
}
