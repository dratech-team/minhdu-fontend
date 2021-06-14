import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FullBranch } from '../../branch/model/branch.model';
import { FullDepartment } from '../../department/model/department.model';
import { Position } from '../../position/model/position.model';
import { EmployeeService } from '../../service/employee.service';
import { FlatSalary } from '../../../../../../../libs/shared/enums/flat-salary.enum';

@Component({
  templateUrl: 'add-employee.component.html'
})
export class AddEmployeeComponent implements OnInit{
  formGroup!: FormGroup;
  branches$!: Observable<FullBranch[]>;
  departments: FullDepartment[] | undefined;
  positions: Position[]| undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
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
        Validators.required,
      ],
      stayedAt: [this.data?.employee?.stayedAt, Validators.required],
      contractAt: [this.data?.employee?.contractAt, Validators.required],
      workedAt: [this.data?.employee?.workedAt, Validators.required],
      price: [3300000, Validators.required],
      note: this.data?.employee?.note,
      certificate: [this.data?.employee?.certificate, Validators.required],
    });
  }

  onBranch(branch: FullBranch): void {
    this.departments = branch.departments;
  }

  onDepartment(department: FullDepartment): void {
    this.positions = department.positions;
  }
  onSubmit(): any {
    const value = this.formGroup.value;
    const employee = {
      name: value.name,
      address: value.address,
      identify: value.identify.toString(),
      idCardAt: new Date(value.idCardAt),
      branchId: value.branch.id,
      departmentId: value.department.id,
      positionId: value.position.id,
      phone: value.phone,
      birthday: new Date(value.birthday),
      gender: value.gender,
      isFlatSalary: value.salaryType === 'flat',
      price: value.price,
      workedAt: new Date(value.workedAt),
      note: value.note,
      stayedAt: value.stayedAt ? new Date(value.stayedAt) : null,
      contractAt: value.contractAt ? new Date(value.contractAt) : null,
      certificate: value.certificate,
    };
    if (this.data?.isUpdate) {
      this.employeeService.update(this.data.employee.id, employee).subscribe();
    } else {
      this.employeeService.addOne(employee).subscribe();
    }
  }
}
