import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-debt',
  templateUrl: 'debts.component.html'
})
export class DebtsComponent  implements OnInit {
  formGroup = new UntypedFormGroup({
    createdAt : new UntypedFormControl(''),
    income : new UntypedFormControl(''),
    name : new UntypedFormControl(''),
    repayment : new UntypedFormControl(''),
  });
  ngOnInit() {
  }
}
