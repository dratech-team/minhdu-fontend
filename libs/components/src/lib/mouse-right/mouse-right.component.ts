import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ContextMenuService } from 'ngx-contextmenu';
import { PageTypeEnum } from '../../../../enums/page-type.enum';

@Component({
  selector: 'app-mouse-right',
  templateUrl: './mouse-right.component.html',
  styleUrls: ['./mouse-right.component.scss']
})
export class MouseRightComponent {
  @Input() type!: PageTypeEnum;
   pageType =  PageTypeEnum;
  @Output() addEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() readAndUpdateEvent = new EventEmitter();
  @Output() payment = new EventEmitter();

  constructor(
    private contextMenuService: ContextMenuService
  ) {
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      event: $event,
      item: item
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  add(item: any): void {
    this.addEvent.emit(item);
  }

  delete(item: any): void {
    this.deleteEvent.emit(item);
  }

  readAndUpdate(item: any): void {
    this.readAndUpdateEvent.emit(item);
  }
  onPayment(item: any): void{
    this.payment.emit(item);
  }
}
