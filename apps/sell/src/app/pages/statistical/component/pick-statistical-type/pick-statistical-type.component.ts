import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterOverviewEnum, OptionOverviewEnum } from '@minhdu-fontend/enums';

@Component({
  selector: 'app-pick-statical',
  templateUrl: 'pick-statistical-type.component.html',
})
export class PickStatisticalTypeComponent implements OnInit {
  @Input() type!: FilterOverviewEnum;
  @Output() EventPrint = new EventEmitter<any>();
  @Output() EventStatistical = new EventEmitter<any>();
  optionOverview = OptionOverviewEnum;
  filterOverview = FilterOverviewEnum;
  formGroup!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      option: [this.optionOverview.SALES, Validators.required],
      startedAt: [undefined, Validators.required],
      endedAt: [undefined, Validators.required],
    });
    this.formGroup.valueChanges.subscribe((val) => {
      if ((val.startedAt && val.endedAt) || (!val.startedAt && !val.endedAt)) {
        this.EventStatistical.emit(val);
      }
    });
  }

  print() {
    const val = this.formGroup.value;
    const params = {
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      option: val.option,
      print: true,
    };
    this.EventPrint.emit(params);
  }
}
