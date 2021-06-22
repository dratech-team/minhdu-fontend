import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import { Branch } from '@minhdu-fontend/data-models';

@Injectable()
export class BranchService {
  constructor(private readonly http: HttpClient) {
  }

  addOne(name: string): Observable<Branch> {
    return this.http.post<Branch>(Api.BRANCH, { name });
  }

  getAll(): Observable<Branch[]> {
    return this.http.get<Branch[]>(Api.ORG_CHART);
  }

  update(id: number, name: string): Observable<Branch> {
    return this.http.patch<Branch>(Api.BRANCH + `/${id}`, { name });
  }
}
