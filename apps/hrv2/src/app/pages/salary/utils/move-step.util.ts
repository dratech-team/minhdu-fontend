import {FormGroup} from "@angular/forms";

export const MoveStepUtil = (type: 'next' | 'previous', indexStep: number, formGroup: FormGroup): number => {
  if (formGroup.invalid) {
    return indexStep
  } else {
    type === 'next' ? indexStep += 1 : indexStep -= 1
    return indexStep
  }
}
