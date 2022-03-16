import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'minhdu-fontend-collapse-status',
  templateUrl: 'collapse-status.component.html'
})
export class CollapseStatusComponent {
  @Input() header = '';
  @Input() active = false;
  @Input() radios: { title: string; value: any }[] = [];
  formGroup = <FormGroup>this.controlContainer.control;

  constructor(private controlContainer: ControlContainer) {
  }

  onChange(result: Date[]): void {
  }
}
