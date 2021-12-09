import { Store } from '@ngrx/store';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimekeepingService {
  constructor(private readonly store: Store) {
  }

}
