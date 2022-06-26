import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-loan',
  templateUrl: 'loan.component.html'
})
export class LoanComponent implements OnInit {
  formGroup = new UntypedFormGroup({
    createdAt : new UntypedFormControl(''),
    income : new UntypedFormControl(''),
    name : new UntypedFormControl(''),
    deadline : new UntypedFormControl(''),
  });
  ngOnInit() {
  }
}
