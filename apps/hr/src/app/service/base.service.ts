import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Employee } from '../employee/models/employee.model';
import { Api } from '../../../../../libs/shared/constants/api.contain';

export class BaseService<T> {
  constructor(
    public readonly url: string,
    public readonly http: HttpClient
  ) {
  }
  pagination(params: any): Observable<ResponsePaginate<T>> {
    return this.http.get<ResponsePaginate<T>>(this.url, {params});
  }

  getAll(): Observable<T[] | undefined> {
    return this.http.get<T[]>(this.url);
  }

  getOne(id: any): Observable<T> {
    return this.http.get<T>(this.url + `/${id}`);
  }

  addOne(props: T | undefined): Observable<T> {
    return this.http.post<T>(this.url, props);
  }

  update(id: any, body: any): Observable<T> {
    return this.http.patch<T>(this.url + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}`);

  }
}
