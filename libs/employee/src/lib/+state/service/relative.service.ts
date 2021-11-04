import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Api } from '@minhdu-fontend/constants';
import { Relative } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class RelativeService extends BaseService<Relative> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.RELATIVE, http);
  }

  addOne(relative: any): Observable<Relative> {
    return super.addOne(relative);
  }

  update(id: number, props: any): Observable<UpdateNum<Relative>> {
    return super.update(id, props);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

}
