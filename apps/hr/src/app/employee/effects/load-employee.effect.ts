import { Injectable } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EmployeeActions } from '../actions';
import { catchError, concatMap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoadEmployeeEffect {
  constructor(
    private readonly action$: Actions,
    private readonly  employeeService: EmployeeService
  ) {
  }
  loadEmployees$ = createEffect(()=>
    this.action$.pipe(
      ofType(EmployeeActions.loadEmployee),
      concatMap((_) => this.employeeService.getAllEmployee({take:30, skip:0 , search:''})),
      map((employees) => EmployeeActions.employeeLoaded({employees})),
      catchError((err) => throwError( err))
    )
  );
}
