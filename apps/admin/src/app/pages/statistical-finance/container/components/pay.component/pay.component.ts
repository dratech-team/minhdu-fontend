import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: 'pay.component.html'
})
export class PayComponent implements OnInit {
  formGroup = new FormGroup({
    createdAt : new FormControl(''),
    income : new FormControl(''),
    name : new FormControl(''),
  });
  ngOnInit() {
  }
}
