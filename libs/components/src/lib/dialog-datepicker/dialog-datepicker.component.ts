import { Component } from '@angular/core';

@Component({
  template: `
    <mat-label>Chọn ngày nhận hàng</mat-label>
    <br />
    <input matInput [matDatepicker]="picker" />
    <mat-datepicker #picker [opened]="true"></mat-datepicker>
  `,
})
export class DialogDatePickerComponent {}
