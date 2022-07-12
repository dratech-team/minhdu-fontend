import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'minhdu-fontend-collapse-radios',
  templateUrl: 'collapse-radio.component.html',
})
export class CollapseRadioComponent implements OnInit {
  @Input() header = '';
  @Input() active = false;
  @Input() controlName = '';
  @Input() radios: { name: string; value: any }[] = [];

  formGroup!: UntypedFormGroup;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.formGroup = <UntypedFormGroup>this.controlContainer.control;
  }
}
