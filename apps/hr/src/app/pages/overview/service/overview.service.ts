import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Chart, stakedChart} from '@minhdu-fontend/data-models';
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class OverviewService {
  constructor(
    public readonly http: HttpClient
  ) {
  }

  overviewAge(params: any): Observable<Chart[]> {
    return this.http.get<Chart[]>(VersionEnum.V2 + Api.HR.OVERVIEW, {params});
  }

  overviewTotalEmp(params: any): Observable<stakedChart[]> {
    return this.http.get<stakedChart[]>(VersionEnum.V2 + Api.HR.OVERVIEW, {params});
  }
}
