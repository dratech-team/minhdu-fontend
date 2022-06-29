import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, UntypedFormGroup } from '@angular/forms';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';

@Component({
  selector: 'app-add-profile',
  templateUrl: 'add-profile.component.html',
})
export class AddProfileComponent implements OnInit {
  @Input() submitted!: boolean;
  @Input() form: any;
  formGroup!: UntypedFormGroup;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.formGroup = <UntypedFormGroup>this.controlContainer.control;
  }
  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }
}
