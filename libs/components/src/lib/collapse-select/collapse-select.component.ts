import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormGroup} from '@angular/forms';

@Component({
  selector: 'minhdu-fontend-collapse-select',
  templateUrl: 'collapse-select.component.html'
})
export class CollapseSelectComponent {
  @Input() header = '';
  @Input() active = false;
  @Input() controlName = '';
  @Input() selectMultiple = false;
  @Input() data!: any []
  @Input() formGroup !: FormGroup;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
}
