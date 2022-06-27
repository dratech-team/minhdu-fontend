import {Component, Input} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {checkInputNumber} from '@minhdu-fontend/utils';
import {GenderTypeConstant} from "@minhdu-fontend/constants";


@Component({
  selector: '@minhdu-fontend-profile',
  templateUrl: 'profile.component.html'
})

export class ProfileComponent {
  @Input() submitting!: boolean
  @Input() form: any
  @Input() formGroup!: UntypedFormGroup;
  genderConstant = GenderTypeConstant
  checkInputNumber(event: any) {
    return checkInputNumber(event)
  }
}
