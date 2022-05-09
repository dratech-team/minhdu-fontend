import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {BonusTypeConstant} from "../../constants/bonus-type.constant";
import {BonusUnitConstant} from "../../constants/bonus-unit.constant";

@Component({
  templateUrl: 'setting-bonus.component.html'
})
export class SettingBonusComponent implements OnInit, AfterViewChecked {

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
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

  onSubmit(): any {

  };
}
