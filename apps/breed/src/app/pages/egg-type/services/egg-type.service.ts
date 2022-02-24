import { BaseService } from '@minhdu-fontend/service';
import { EggTypeEntity } from '../entities/egg-type.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { CreateEggTypeDto } from '../dto/create-egg-type.dto';
import { SearchEggTypeDto } from '../dto/search-egg-type.dto';
import { Injectable } from '@angular/core';

@Injectable()
export class EggTypeService extends BaseService<EggTypeEntity> {
  constructor(public http: HttpClient) {
    super(Api.BREED.EGG_TYPE, http);
  }

  addOne(props: CreateEggTypeDto): Observable<EggTypeEntity> {
    return super.addOne(props);
  }

  getAll(params?: SearchEggTypeDto): Observable<EggTypeEntity[]> {
    return super.getAll(params);
  }
}
