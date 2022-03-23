import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'minhdu-fontend-collapse-datepicker',
  templateUrl: 'collapse-datepicker.component.html'
})
export class CollapseDatepickerComponent implements OnInit {
  @Input() title: string = '';
  @Input() endedAtInit: Date = getFirstDayInMonth(new Date());
  @Input() startedAtInit: Date = getLastDayInMonth(new Date());
  @Output() onPicker = new EventEmitter<any>();
  formTitlePicker = new FormControl();
  formRange = new FormControl();
  formRadio = new FormControl()
  visible = false

  constructor(
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    console.log(getFirstDayInMonth(new Date()))
    this.formRange.valueChanges.subscribe(val => {
      this.formRadio.setValue(1)
      this.onPicker.emit({
        start: val[0], end: val[1]
      });
    })
  }

  onTitlePicker($event: any) {
    this.visible = false
    this.formTitlePicker.setValue($event.titleDatepicker.title)
    this.onPicker.emit({
      start: $event.titleDatepicker.startedAt,
      end: $event.titleDatepicker.endedAt
    });
  }
}
