import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ContextMenuService } from 'ngx-contextmenu';
import { ItemContextMenu } from '../../../../enums/sell/page-type.enum';

@Component({
  selector: 'app-mouse-right',
  templateUrl: './mouse-right.component.html',
  styleUrls: ['./mouse-right.component.scss']
})
export class MouseRightComponent {
  @Input() items?: ItemContextMenu[];
  ItemContextMenu = ItemContextMenu;
  @Output() addEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() permanentlyDeletedEvent = new EventEmitter();
  @Output() readEvent = new EventEmitter();
  @Output() payment = new EventEmitter();
  @Output() delivered = new EventEmitter();
  @Output() restore = new EventEmitter();
  @Output() HistoryPayroll = new EventEmitter();
  @Output() Employee = new EventEmitter();
  @Output() payroll = new EventEmitter();
  @Output() overtime = new EventEmitter();
  @Output() listPosition = new EventEmitter();
  @Output() update = new EventEmitter();

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

  permanentlyDeleted(item: any): void {
    this.permanentlyDeletedEvent.emit(item);
  }

  readAndUpdate(item: any): void {
    this.readEvent.emit(item);
  }

  onPayment(item: any): void {
    this.payment.emit(item);
  }

  onDelivered(item: any) {
    this.delivered.emit(item);
  }

  onRestore(item: any) {
    this.restore.emit(item);
  }
  onHistoryPayroll(item: any) {
    this.HistoryPayroll.emit(item);
  }
  onEmployee(item: any) {
    this.Employee.emit(item);
  }

  onPayroll(item: any) {
    this.payroll.emit(item);
  }
  onOvertime(item: any) {
    this.overtime.emit(item);
  }

  onListPosition(item: any) {
    this.listPosition.emit(item);
  }

  onUpdate(item: any) {
    this.update.emit(item);
  }
}
