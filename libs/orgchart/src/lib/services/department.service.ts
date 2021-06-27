import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Branch, Department } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity';
import { BaseService } from '@minhdu-fontend/service';

@Injectable()
export class DepartmentService extends BaseService<Department> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.DEPARTMENT, http);
  }


  addOne(props: Department): Observable<Department> {
    return super.addOne(props);
  }

  getAll(): Observable<Department[]> {
    return super.getAll();
  }

  update(id: number, body: any): Observable<Update<Branch>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
