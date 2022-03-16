import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroup} from '@angular/forms';

@Component({
  selector: 'minhdu-fontend-collapse-radios',
  templateUrl: 'collapse-radios.component.html'
})
export class CollapseRadiosComponent implements OnInit{
  @Input() header = '';
  @Input() active = false;
  @Input() controlName = '';
  @Input() radios: { name: string; value: any }[] = [];

  formGroup !: FormGroup

  constructor(private controlContainer: ControlContainer) {
  }

  ngOnInit() {
    this.formGroup = <FormGroup>this.controlContainer.control;
  }
}
