import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  templateUrl: 'dialog-org-chart.component.html',
  styleUrls: ['dialog-org-chart.component.scss']
})
export class DialogOrgChartComponent implements OnInit {
  formGroupOrgChart!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.formGroupOrgChart = this.formBuilder.group({
      inputOrgChart: [this.data.isEdit === true ? this.data.data?.name : '', Validators.required],
      workday: [this.data.data?.workday, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroupOrgChart.value;
    return {
      id: this.data.data?.id,
      name: value.inputOrgChart,
      departmentId: this.data?.data?.id,
      branchId: this.data.data?.id,
      workday: value.workday
    };
  }
}
