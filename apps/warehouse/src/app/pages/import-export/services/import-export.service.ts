import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { ImportExportEntity } from '../entities/import-export.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable()
export class ImportExportService extends BaseService<ImportExportEntity> {
  constructor(public http: HttpClient) {
    super(Api.WAREHOUSE.HISTORY, http);
  }

  pagination(params?: any): Observable<ResponsePaginate<ImportExportEntity>> {
    return super.pagination(params);
  }
}
