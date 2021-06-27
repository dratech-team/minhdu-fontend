import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import { Branch, Department, ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import { Payroll } from '../../../../../apps/hr/src/app/pages/payroll/+state/payroll.interface';
import { Update } from '@ngrx/entity';

@Injectable()
export class BranchService extends BaseService<Branch> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.BRANCH, http);
  }


  addOne(props: Branch): Observable<Branch> {
    return super.addOne(props);
  }

  getAll(): Observable<Branch[]> {
    return super.getAll();
  }

  update(id: any, body: any): Observable<Update<Branch>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
