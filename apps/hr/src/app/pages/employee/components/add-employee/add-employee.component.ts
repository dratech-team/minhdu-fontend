import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee, updateEmployee } from '../../+state/employee/employee.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';
import { Employee } from '../../+state/employee/employee.interface';

@Component({
  templateUrl: 'add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      typeSalary: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      identify: ['',Validators.required],
      idCardAt: [ Validators.required],
      branch: [ Validators.required],
      department: ['', Validators.required],
      position: ['',Validators.required],
      phone: [ '',Validators.required],
      birthday: [ '',Validators.required],
      gender: [ '', Validators.required],
      salaryType: ['',Validators.required],
      stayedAt: [this.data?.employee?.stayedAt, Validators.required],
      workedAt: [this.data?.employee?.workedAt, Validators.required],
      note: this.data?.employee?.note,
      createdAt: [this.data?.employee?.createdAt, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const employee = {
      name: value.name,
      address: value.address,
      identify: value.identify.toString(),
      idCardAt: new Date(value.idCardAt),
      branchId: 1,
      departmentId: 1,
      positionId: 1,
      phone: value.phone,
      birthday: new Date(value.birthday),
      gender: value.gender,
      isFlatSalary: value.salaryType === 'flat',
      workedAt: new Date(value.workedAt),
      note: value.note,
      stayedAt: value.stayedAt ? new Date(value.stayedAt) : null,
      birthplace: 'sadasds',
      createdAt: new Date(value.createdAt)
    };
      this.store.dispatch(addEmployee({ employee: employee }));
  }
}
