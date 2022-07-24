import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable()
export class StatisticalService {
  constructor(
    public readonly http: HttpClient
  ) {
  }

  getAll(url: string, params: any): Observable<any[]> {
    return this.http.get<any[]>(VersionEnum.V1 + url, { params });
  }
}
