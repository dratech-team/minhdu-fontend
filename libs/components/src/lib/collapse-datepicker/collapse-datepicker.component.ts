import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RangeDay } from '@minhdu-fontend/data-models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'minhdu-fontend-collapse-datepicker',
  templateUrl: 'collapse-datepicker.component.html'
})
export class CollapseDatepickerComponent implements OnInit, AfterContentInit {
  @Input() title: string = '';
  @Input() rangeDayInit?: RangeDay;
  @Output() onPicker = new EventEmitter<{ start: Date, end: Date }>();

  tooltip = '';

  formTitlePicker = new FormControl();
  formRange = new FormControl();
  formRadio = new FormControl();
  visible = false;

  constructor(
    private readonly changeDetection: ChangeDetectorRef,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.formRange.valueChanges.subscribe((val) => {
      this.formRadio.setValue(1);
      this.onPicker.emit({
        start: val[0],
        end: val[1]
      });
      this.tooltip = val[0] && val[1]
        ? `Từ ${this.datePipe.transform(val[0], 'dd/MM/YYYY')} tới ${this.datePipe.transform(val[1], 'dd/MM/YYYY')}`
        : '';
    });
  }

  ngAfterContentInit(): void {
    this.changeDetection.detectChanges();
  }

  onTitlePicker(picker: { title: string, startedAt: Date, endedAt: Date }) {
    this.visible = false;
    this.formTitlePicker.setValue(picker.title);
    this.onPicker.emit({
      start: picker.startedAt,
      end: picker.endedAt
    });
    this.tooltip = `Từ ${this.datePipe.transform(picker.startedAt, 'dd/MM/YYYY')} tới ${this.datePipe.transform(picker.endedAt, 'dd/MM/YYYY')}`;
  }
}
