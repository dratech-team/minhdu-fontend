import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EmployeeService } from '../service/employee.service';

@Injectable()
export class AddEmployeeEffect {
  constructor(
    private readonly action$: Actions,
    private readonly  employeeService: EmployeeService
  ) {
  }
}
