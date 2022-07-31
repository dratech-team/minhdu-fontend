import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'md-rich-text',
  templateUrl: 'rich-text.component.html'
})
export class RichTextComponent {
  @Input() description: string = '';
  submitted = false;

  formGroup = new FormGroup({
    reason: new FormControl<string | null>(null)
  });

  constructor() {
  }
}
