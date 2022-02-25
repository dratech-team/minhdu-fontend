import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { IncubatorFactoryEntity } from '../entities/incubator-factory.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { CreateIncubatorFactoryDto } from '../dto/create-incubator-factory.dto';
import { SearchIncubatorFactoryDto } from '../dto/search-incubator-factory.dto';
import {ResponsePaginate} from "@minhdu-fontend/data-models";

@Injectable()
export class IncubatorFactoryService extends BaseService<IncubatorFactoryEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.BREED.EGG, http);
  }

  addOne(props: CreateIncubatorFactoryDto): Observable<IncubatorFactoryEntity> {
    return super.addOne(props);
  }

  getAll(params?: SearchIncubatorFactoryDto): Observable<IncubatorFactoryEntity[]> {
    return super.getAll(params);
  }
  pagination(params?: SearchIncubatorFactoryDto): Observable<ResponsePaginate<IncubatorFactoryEntity>> {
    return super.pagination(params);
  }
}
