import { select, Store } from '@ngrx/store';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '@minhdu-fontend/data-models';

@Injectable({ providedIn: 'root' })
export class PickEmployeeService {
  constructor(
    private readonly http: HttpClient
  ) {
  }

  onInit(val?: any): Observable<any> {
   return  this.http.get<any>('employee/salary/overtime', { params: val });
  }
}
