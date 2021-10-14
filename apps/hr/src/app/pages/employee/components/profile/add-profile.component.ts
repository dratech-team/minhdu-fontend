import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { login } from '@minhdu-fontend/auth';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';


@Component({
  selector: 'app-add-profile',
  templateUrl: 'add-profile.component.html'
})

export class AddProfileComponent implements OnInit  {
  @Input() submitted!: boolean
  @Input() form: any
  formGroup!: FormGroup;

  constructor(
    private controlContainer: ControlContainer
  ) {
  }

  ngOnInit(): void {
    this.formGroup = <FormGroup>this.controlContainer.control;
  }
  checkInputNumber(event: any){
    return checkInputNumber(event)
  }
}
