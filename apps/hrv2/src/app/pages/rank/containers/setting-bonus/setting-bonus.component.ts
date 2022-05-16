import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
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

  formGroup = new FormGroup({
    bonusType: new FormControl(''),
    unit: new FormControl(''),
    rate: new FormControl(''),
    price: new FormControl(''),
    rating: new FormControl(''),
    diligent: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
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
