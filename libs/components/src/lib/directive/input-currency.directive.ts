import { DecimalPipe } from '@angular/common';
import { Directive, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[inputCurrency]'
})
export class InputCurrencyDirective implements OnInit {
  currencyChars = new RegExp('[\.,]', 'g');

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    private decimalPipe: DecimalPipe
  ) {
  }

  ngOnInit() {
    this.format(this.el.nativeElement.value);
  }

  @HostListener('input', ['$event.target.value']) onInput(e: string) {
    this.format(e);
  };

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    if (event.clipboardData) {
      this.format(event.clipboardData.getData('text/plain'));
    }
  }

  format(val: string) {
    const numberFormat = parseInt(String(val).replace(this.currencyChars, ''));
    const vnd = this.decimalPipe.transform(numberFormat, '1.0', 'en-US');
    this.renderer.setProperty(this.el.nativeElement, 'value', vnd);
  }
}
