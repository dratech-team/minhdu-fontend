import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import { Branch } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import { Update } from '@ngrx/entity';

@Injectable()
export class BranchService extends BaseService<Branch> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.BRANCH, http);
  }


  addOne(props: any): Observable<Branch> {
    return super.addOne(props);
  }

  getAll(): Observable<Branch[]> {
    return super.getAll();
  }

  getOne(id: any): Observable<Branch> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Branch>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
