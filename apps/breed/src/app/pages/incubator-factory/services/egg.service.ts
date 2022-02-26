import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { EggEntity } from '../entities/egg.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { AddEggDto } from '../dto/add-egg.dto';

@Injectable()
export class EggService extends BaseService<EggEntity> {
  constructor(public http: HttpClient) {
    super(Api.BREED.EGG, http);
  }

  addOne(props: AddEggDto): Observable<EggEntity> {
    return super.addOne(props);
  }
}
