import {Component, Input, OnInit} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {ControlContainer, FormGroup} from "@angular/forms";

@Component({
  selector: 'minhdu-fontend-collapse-status',
  templateUrl: 'collapse-status.component.html'
})
export class CollapseComponent implements OnInit{
  @Input() header = ''
  @Input() active = false
  @Input() radios!: {title: string ; value: any}[]
  formGroup!: FormGroup
  constructor(private controlContainer: ControlContainer) {
  }
  ngOnInit() {
    this.formGroup = <FormGroup>this.controlContainer.control;
  }

  onChange(result: Date[]): void {
  }
}
