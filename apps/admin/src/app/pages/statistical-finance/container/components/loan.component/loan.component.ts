import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-loan',
  templateUrl: 'loan.component.html'
})
export class LoanComponent implements OnInit {
  formGroup = new FormGroup({
    createdAt : new FormControl(''),
    income : new FormControl(''),
    name : new FormControl(''),
    deadline : new FormControl(''),
  });
  ngOnInit() {
  }
}
