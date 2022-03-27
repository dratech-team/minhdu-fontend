import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { MigrateEntity } from '../entities/migrate.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { SearchMigrateDto } from '../dto/search-migrate.dto';

@Injectable()
export class MigrateService extends BaseService<MigrateEntity> {
  constructor(public http: HttpClient) {
    super(Api.WAREHOUSE.HISTORY, http);
  }

  pagination(params?: Partial<SearchMigrateDto>): Observable<ResponsePaginate<MigrateEntity>> {
    return super.pagination(params);
  }
}
