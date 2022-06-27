import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.component.html'
})
export class PayComponent implements OnInit {
  formGroup = new UntypedFormGroup({
    createdAt : new UntypedFormControl(''),
    income : new UntypedFormControl(''),
    name : new UntypedFormControl(''),
  });
  ngOnInit() {
  }
}
