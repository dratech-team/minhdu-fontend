import {Component, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {BonusTypeConstant} from "../../constants/bonus-type.constant";
import {BonusUnitConstant} from "../../constants/bonus-unit.constant";
import {Router} from "@angular/router";
import {Actions} from "@datorama/akita-ng-effects";
import {SettingBonusActions} from "../../state/setting-bonus/setting-bonus.action";
import {SettingBonusQuery} from "../../state/setting-bonus/setting-bonus.query";

@Component({
  templateUrl: 'setting-bonus.component.html'
})
export class SettingBonusComponent implements OnInit {
  added$ = this.settingBonusQuery.select(state => state.added)
  bonusConstant = BonusTypeConstant
  bonusUnitConstant = BonusUnitConstant

  formGroup = new UntypedFormGroup({
    bonusType: new UntypedFormControl(''),
    unit: new UntypedFormControl(''),
    rate: new UntypedFormControl(''),
    price: new UntypedFormControl(''),
    rating: new UntypedFormControl(''),
    diligent: new UntypedFormControl(''),
    from: new UntypedFormControl(''),
    to: new UntypedFormControl(''),
  });

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly settingBonusQuery: SettingBonusQuery
  ) {
  }

  ngOnInit() {
    this.formGroup.get('diligent')?.valueChanges.subscribe(val =>
      this.formGroup.get('diligent')?.setValue(val.toUpperCase(), {emitEvent: false})
    )
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    this.actions$.dispatch(SettingBonusActions.addOne({
      body: Object.assign({},
        this.formGroup.value,
        {rankSettingId: this.formGroup.value.rating.id})
    }))
  };

  onCancel() {
    this.router.navigate(['xep-hang']).then()
  }
}
