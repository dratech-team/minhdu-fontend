import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Employee} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class DegreeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.DEGREE, http);
  }

  addOneDegree(relative: any): Observable<Employee> {
    return this.http.post<Employee>(this.url, relative);
  }

  update(id: number, props: any): Observable<Employee> {
    return super.update(id, props);
  }

  deleteDegree(id: number): Observable<Employee> {
    return this.http.delete<Employee>(this.url + `/${id}`);
  }

  deleteContracts(id: number): Observable<void> {
    return this.http.delete<void>(VersionEnum.V2 + Api.HR.EMPLOYEE.CONTRACT + `/${id}`);
  }
}
