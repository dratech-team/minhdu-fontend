import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  constructor(public readonly http: HttpClient) {}

  timekeeping(body: any): Observable<any> {
    return this.http.post<any>(VersionEnum.V1 + Api.CHECKLIST, body);
  }
}
