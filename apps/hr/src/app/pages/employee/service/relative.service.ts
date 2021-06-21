import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../service/base.service';
import { Update } from '@ngrx/entity/src/models';
import { Api } from '@minhdu-fontend/constants';
import { Employee } from '../+state/employee.interface';


@Injectable({ providedIn: 'root' })
export class RelativeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.RELATIVE, http);
  }


  addOne(relative: any): Observable<Employee> {
    return super.addOne(relative)
  }
  update(EmployeeId: number, props: any ): Observable<Update<Employee>> {
    return super.update(EmployeeId, props);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }



}
