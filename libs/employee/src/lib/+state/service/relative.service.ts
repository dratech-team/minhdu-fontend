import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Api } from '@minhdu-fontend/constants';
import { Employee, Relative } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class RelativeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.RELATIVE, http);
  }

  addOneRelative(relative: any): Observable<UpdateNum<Employee>> {
    return this.http.post<UpdateNum<Employee>>(this.url, relative);
  }

  update(id: number, props: any): Observable<UpdateNum<Employee>> {
    return super.update(id, props);
  }

  deleteRelative(id: number): Observable<UpdateNum<Employee>> {
    return this.http.delete<UpdateNum<Employee>>(Api.HR.EMPLOYEE.RELATIVE + `/${id}`);
  }

}
