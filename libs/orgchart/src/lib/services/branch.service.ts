import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchEntity } from '@minhdu-fontend/orgchart';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';

@Injectable()
export class BranchService {
  constructor(private readonly http: HttpClient) {
  }

  addOne(name: string): Observable<BranchEntity> {
    return this.http.post<BranchEntity>(Api.BRANCH, { name });
  }

  getAll(): Observable<BranchEntity[]> {
    return this.http.get<BranchEntity[]>(Api.ORG_CHART);
  }

  update(id: number, name: string): Observable<BranchEntity> {
    return this.http.patch<BranchEntity>(Api.BRANCH + `/${id}`, { name });
  }
}
