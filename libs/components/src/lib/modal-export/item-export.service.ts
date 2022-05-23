import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class ItemExportService {
  constructor(public readonly http: HttpClient) {
  }

  getItemExport(params?: any): Observable<any[]> {
    return this.http.get<any>(VersionEnum.V2 + (params?.api || Api.HR.EXPORT), {params});
  }
}
