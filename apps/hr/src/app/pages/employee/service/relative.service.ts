import { Injectable } from '@angular/core';
import { BaseService } from '../../../service/base.service';
import {  Relative } from '../+state/employee/employee.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity/src/models';

@Injectable({providedIn:'root'})
export class RelativeService extends BaseService<Relative>{
  constructor( public readonly http: HttpClient) {
    super(Api.RELATIVE, http);
  }

  addOne(Relative: Relative): Observable<Relative> {
    return super.addOne(Relative);
  }
  update(id: number, props: Relative ): Observable<Update<Relative>> {
    return super.update(id, props);
  }
  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
