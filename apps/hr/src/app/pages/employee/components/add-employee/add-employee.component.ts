import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee, updateEmployee } from '../../+state/employee.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';
import { Employee } from '../../+state/employee.interface';

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
      name: [this.data?.employee?.name, Validators.required],
      address: [this.data?.employee?.address, Validators.required],
      identify: [this.data?.employee?.identify, Validators.required],
      idCardAt: [this.data?.employee?.idCardAt, Validators.required],
      branch: [this.data?.employee?.branch?.name, Validators.required],
      department: [this.data?.employee?.department?.name, Validators.required],
      position: [this.data?.employee?.position, Validators.required],
      phone: [this.data?.employee?.phone, Validators.required],
      birthday: [this.data?.employee?.birthday, Validators.required],
      gender: [this.data?.employee?.gender, Validators.required],
      salaryType: [
        this.data?.isFlatSalary
          ? FlatSalary.FLAT_SALARY
          : FlatSalary.NOT_FLAT_SALARY,
        Validators.required
      ],
      stayedAt: [this.data?.employee?.stayedAt, Validators.required],
      workedAt: [this.data?.employee?.workedAt, Validators.required],
      note: this.data?.employee?.note,
      createdAt: [this.data?.employee?.createdAt, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const employee: Employee = {
      name: value.name,
      address: value.address,
      identify: value.identify.toString(),
      idCardAt: new Date(value.idCardAt),
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
    if (this.data.isUpdate) {
      this.store.dispatch(updateEmployee({ id: this.data.employee.id, employee: employee }));
    } else {
      this.store.dispatch(addEmployee({ employee: employee }));
    }
  }
}
