import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrgchartEnum } from '@minhdu-fontend/enums';


@Component({
  templateUrl: 'dialog-org-chart.component.html',
  styleUrls: ['dialog-org-chart.component.scss']
})
export class DialogOrgChartComponent implements OnInit {
  formGroupOrgChart!: FormGroup;
  type = OrgchartEnum;
  submitted = false
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogOrgChartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if(this.data.type === this.type.POSITION){
      this.formGroupOrgChart = this.formBuilder.group({
        inputOrgChart: [this.data.isEdit === true ? this.data.data?.name : '', Validators.required],
        workday: [this.data.data?.workday, Validators.required]
      });
    }else {
      this.formGroupOrgChart = this.formBuilder.group({
        inputOrgChart: [this.data.isEdit === true ? this.data.data?.name : '', Validators.required],
      });
    }
  }

  get f() {
    return this.formGroupOrgChart.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroupOrgChart.invalid) {
      return;
    }
    const value = this.formGroupOrgChart.value;
    const val = {
      id: this.data.data?.id,
      name: value.inputOrgChart,
      departmentId: this.data?.data?.id,
      branchId: this.data.data?.id,
      workday: value.workday
    };
    this.dialogRef.close(val)
  }
}
