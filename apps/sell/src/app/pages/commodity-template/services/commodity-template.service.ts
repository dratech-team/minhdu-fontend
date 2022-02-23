import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { CommodityTemplateEntity } from '../entities/commodity-template.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommodityTemplateService extends BaseService<CommodityTemplateEntity> {
  constructor(public http: HttpClient) {
    super(Api.SELL.COMMODITY_TEMPLATE, http);
  }

  getAll(params?: any): Observable<CommodityTemplateEntity[]> {
    return super.getAll(params);
  }
}
