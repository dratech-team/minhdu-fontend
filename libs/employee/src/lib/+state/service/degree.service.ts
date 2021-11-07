import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Api } from '@minhdu-fontend/constants';
import { Degree, Employee } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class DegreeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.DEGREE, http);
  }

  addOneDegree(relative: any): Observable<UpdateNum<Employee>> {
    return this.http.post<UpdateNum<Employee>>(Api.DEGREE, relative);
  }

  update(id: number, props: any): Observable<UpdateNum<Employee>> {
    return super.update(id, props);
  }

  deleteDegree(id: number): Observable<UpdateNum<Employee>>{
    return this.http.delete<UpdateNum<Employee>>(Api.DEGREE + `/${id}`);
  }

  deleteContracts(id: number): Observable<void>{
    return this.http.delete<void>(Api.CONTRACT + `/${id}`);
  }
}
