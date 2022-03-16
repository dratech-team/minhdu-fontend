import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroup} from '@angular/forms';

@Component({
  selector: 'minhdu-fontend-collapse-status',
  templateUrl: 'collapse-status.component.html'
})
export class CollapseStatusComponent implements OnInit{
  @Input() header = '';
  @Input() active = false;
  @Input() radios: { title: string; value: any }[] = [];
  formGroup !: FormGroup

  constructor(private controlContainer: ControlContainer) {
  }

  ngOnInit() {
    this.formGroup = <FormGroup>this.controlContainer.control;
  }
}
