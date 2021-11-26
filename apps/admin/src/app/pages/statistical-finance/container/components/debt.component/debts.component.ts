import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-debt',
  templateUrl: 'debts.component.html'
})
export class DebtsComponent  implements OnInit {
  formGroup = new FormGroup({
    createdAt : new FormControl(''),
    income : new FormControl(''),
    name : new FormControl(''),
    repayment : new FormControl(''),
  });
  ngOnInit() {
  }
}
