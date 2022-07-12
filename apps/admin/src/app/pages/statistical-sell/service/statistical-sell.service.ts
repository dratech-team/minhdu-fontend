import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { OverviewSell } from '../entity/overview.entity';
import { Injectable } from '@angular/core';

@Injectable()
export class StatisticalSellService {
  constructor(private readonly http: HttpClient) {}

  getAll(params: any): Observable<OverviewSell> {
    return this.http.get<OverviewSell>(Api.SELL.OVERVIEW, { params });
  }
}
