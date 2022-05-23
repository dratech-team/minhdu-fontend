import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Employee} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';

@Injectable({providedIn: 'root'})
export class RelativeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.RELATIVE, http);
  }

  addOneRelative(relative: any): Observable<Employee> {
    return this.http.post<Employee>(this.url, relative);
  }

  update(id: number, props: any): Observable<Employee> {
    return super.update(id, props);
  }

  deleteRelative(id: number): Observable<Employee> {
    return this.http.delete<Employee>(this.url + `/${id}`);
  }

}
