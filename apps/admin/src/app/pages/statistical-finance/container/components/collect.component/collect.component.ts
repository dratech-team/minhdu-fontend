import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collect',
  templateUrl: 'collect.component.html'
})
export class CollectComponent implements OnInit {
  formGroup = new FormGroup({
    createdAt : new FormControl(''),
    income : new FormControl(''),
    name : new FormControl(''),
  });
  ngOnInit() {
  }
}
