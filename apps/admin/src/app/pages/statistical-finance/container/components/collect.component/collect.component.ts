import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-collect',
  templateUrl: 'collect.component.html'
})
export class CollectComponent implements OnInit {
  formGroup = new UntypedFormGroup({
    createdAt : new UntypedFormControl(''),
    income : new UntypedFormControl(''),
    name : new UntypedFormControl(''),
  });
  ngOnInit() {
  }
}
