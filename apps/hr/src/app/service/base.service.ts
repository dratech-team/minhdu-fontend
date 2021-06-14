import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {cacheable, EntityStore, PaginationResponse} from '@datorama/akita';
import {catchError, tap} from 'rxjs/operators';

export class BaseService<T> {
  constructor(
    public readonly url: string,
    public readonly http: HttpClient,
    public readonly store: EntityStore
  ) {
  }


  getAll(): Observable<T[]| undefined> {
    const request$ = this.http.get<T[]>(this.url).pipe(
      tap((res) => {
        this.store.set(res);
      })
    );
    return cacheable<T[]| undefined>(this.store, request$);
  }

  getOne(id: any): Observable<T> {
    return this.http.get<T>(this.url + `/${id}`).pipe(
      tap((res) => this.store.add(res)),
      catchError((err) => {
        this.store.setError(err);
        return throwError(err);
      })
    );
  }

  addOne(props: T| undefined,): Observable<T> {
    return this.http.post<T>(this.url, props).pipe(
      tap((res) => {
        this.store.add(res);
        /// FIXME: Bùa chú
        window.location.reload();
      }),
      catchError((err) => {
        console.error(err);
        this.store.setError(err);
        return throwError(err);
      })
    );
  }

  update(id: any, body: any): Observable<T> {
    return this.http.patch<T>(this.url + `/${id}`, body).pipe(
      tap((_) => {
        this.store.update(id, body);
        /// FIXME: Bùa chú
        window.location.reload();
      })
    );
  }

  delete(id: any): Observable<any> {
    return this.http.delete(this.url + `/${id}`).pipe(
      tap(_ => {
        this.store.remove(id);
        /// FIXME: Bùa chú
        window.location.reload();
      })
    );
  }
}
