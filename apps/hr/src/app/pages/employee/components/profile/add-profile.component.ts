import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector:'app-add-profile',
  templateUrl: 'add-profile.component.html'
})
export class AddProfileComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = <FormGroup>this.controlContainer.control;
  }
}
