import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemExportService {
  constructor(public readonly http: HttpClient) {
  }

  getItemExport(params: any): Observable<any[]> {
    console.log(params)
    return this.http.get<any>(params?.api || Api.HR.PAYROLL.ITEMS_EXPORT,{params});
  }
}
