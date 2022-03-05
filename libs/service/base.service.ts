import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Update, UpdateNum } from '@ngrx/entity/src/models';
import { ResponsePaginate } from '../data-models';

export class BaseService<T> {
  constructor(
    public readonly url: string,
    public readonly http: HttpClient
  ) {
  }

  pagination(params?: any): Observable<ResponsePaginate<T> | any> {
    return this.http.get<ResponsePaginate<T> | any>(this.url, { params });
  }

  getAll(params?: any): Observable<T[]> {
    return this.http.get<T[]>(this.url, { params });
  }

  getOne(id: any): Observable<T> {
    return this.http.get<T>(this.url + `/${id}`);
  }

  addOne(props: any): Observable<T> {
    return this.http.post<T>(this.url, props);
  }

  update(id: any, body: any): Observable<UpdateNum<T>> {
    return this.http.patch<UpdateNum<T>>(this.url + `/${id}`, body);
  }

  delete(id: number, params?: any): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}`, { params });
  }
}
