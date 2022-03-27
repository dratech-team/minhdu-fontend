import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import { AddCommodityDto } from '../dto/add-commodity.dto';
import { CommodityEntity } from '../entities/commodity.entity';
import { SearchCommodityDto } from '../dto/search-commodity.dto';
import { UpdateCommodityDto } from '../dto/update-commodity.dto';

@Injectable({ providedIn: 'root' })
export class CommodityService extends BaseService<CommodityEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.COMMODITY, http);
  }

  addOne(props: AddCommodityDto): Observable<CommodityEntity> {
    return super.addOne(props);
  }

  getAll(params?: any): Observable<CommodityEntity[]> {
    return super.getAll(params);
  }

  getTemplate(): Observable<any> {
    return this.http.get(Api.SELL.COMMODITY_TEMPLATE);
  }

  pagination(params: SearchCommodityDto): Observable<ResponsePaginate<CommodityEntity>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<CommodityEntity> {
    return super.getOne(id);
  }

  update(id: any, body: Partial<UpdateCommodityDto>): Observable<CommodityEntity> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
