import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { RateConditionEntity } from '../entities/rate-condition.entity';
import { SearchRateConditionDto } from '../dto/rate-condition/search-rate-condition.dto';
import { AddRateConditionDto } from '../dto/rate-condition/add-rate-condition.dto';
import { UpdateRateConditionDto } from '../dto/rate-condition/update-rate-condition.dto';

@Injectable({ providedIn: 'root' })
export class RateConditionService extends BaseService<RateConditionEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.SETTING_RATE_CONDITION, http);
  }

  pagination(
    params?: SearchRateConditionDto
  ): Observable<ResponsePaginate<RateConditionEntity>> {
    return super.pagination(params?.search);
  }

  addOne(addDto: AddRateConditionDto): Observable<RateConditionEntity> {
    return super.addOne(addDto.body);
  }

  getAll(): Observable<RateConditionEntity[]> {
    return super.getAll();
  }

  update(props: UpdateRateConditionDto): Observable<RateConditionEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: any): Observable<void> {
    return super.delete(id);
  }
}
