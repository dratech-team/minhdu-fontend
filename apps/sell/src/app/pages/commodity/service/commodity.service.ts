import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { AddCommodityDto } from '../dto';
import { CommodityEntity } from '../entities';
import { SearchCommodityDto } from '../dto';
import { UpdateCommodityDto } from '../dto';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class CommodityService extends BaseService<CommodityEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.COMMODITY, http);
  }

  addOne(props: AddCommodityDto): Observable<CommodityEntity> {
    return super.addOne(props.body);
  }

  getAll(params?: any): Observable<CommodityEntity[]> {
    return super.getAll(params);
  }

  pagination(
    params: SearchCommodityDto
  ): Observable<ResponsePaginate<CommodityEntity>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<CommodityEntity> {
    return super.getOne(id);
  }

  update(props: UpdateCommodityDto): Observable<CommodityEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
