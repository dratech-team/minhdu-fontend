import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity/src/models';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

export class BaseService<T> {
  constructor(
    public readonly url: string,
    public readonly http: HttpClient
  ) {
  }

  pagination(params: any): Observable<ResponsePaginate<T>> {
    return this.http.get<ResponsePaginate<T>>(this.url, { params });
  }

  getAll(): Observable<T[] | undefined> {
    return this.http.get<T[]>(this.url);
  }

  getOne(id: any): Observable<T> {
    return this.http.get<T>(this.url + `/${id}`);
  }

  addOne(props: T ): Observable<T> {
    return this.http.post<T>(this.url, props);
  }

  update(id: any, body: any): Observable<Update<T>> {
    return this.http.patch<Update<T>>(this.url + `/${id}`, body);
  }

  delete(id: number ): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}`);
  }
}
