import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {BonusTypeConstant} from "../../constants/bonus-type.constant";
import {BonusUnitConstant} from "../../constants/bonus-unit.constant";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'setting-bonus.component.html'
})
export class SettingBonusComponent implements OnInit {

  bonusConstant = BonusTypeConstant
  bonusUnitConstant = BonusUnitConstant

  formGroup = new FormGroup({
    bonusType: new FormControl(''),
    unit: new FormControl(''),
    rate: new FormControl(''),
    price: new FormControl(''),
    ratings: new FormControl(''),
    diligent: new FormControl(''),
    from: new FormControl(''),
    to: new FormControl(''),
  });
  pageSize = 10

  constructor(
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.formGroup.get('diligent')?.valueChanges.subscribe(val =>
      this.formGroup.get('diligent')?.setValue(val.toUpperCase(), {emitEvent: false})
    )
  }

  onSubmit(): any {

  };

  onCancel() {
    this.router.navigate(['xep-hang']).then()
  }
}
