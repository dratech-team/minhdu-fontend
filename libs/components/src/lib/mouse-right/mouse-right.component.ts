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
  @Output() onAddOrder = new EventEmitter();
  @Output() onAdd = new EventEmitter();
  @Output() onDel = new EventEmitter();
  @Output() onDelPerm = new EventEmitter();
  @Output() onDetail = new EventEmitter();
  @Output() onPay = new EventEmitter();
  @Output() onEnd = new EventEmitter();
  @Output() onRestore = new EventEmitter();
  @Output() onHisPayroll = new EventEmitter();
  @Output() onProfile = new EventEmitter();
  @Output() onPayroll = new EventEmitter();
  @Output() onOvertime = new EventEmitter();
  @Output() onPositions = new EventEmitter();
  @Output() onUpdate = new EventEmitter();

  constructor(private contextMenuService: ContextMenuService) {
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      event: $event,
      item: item
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  addOrder(item: any): void {
    this.onAddOrder.emit(item);
  }

  add(item: any): void {
    this.onAdd.emit(item);
  }

  delete(item: any): void {
    this.onDel.emit(item);
  }

  update(item: any) {
    this.onUpdate.emit(item);
  }

  permanentlyDeleted(item: any): void {
    this.onDelPerm.emit(item);
  }

  readAndUpdate(item: any): void {
    this.onDetail.emit(item);
  }

  onPayment(item: any): void {
    this.onPay.emit(item);
  }

  onDelivered(item: any) {
    this.onEnd.emit(item);
  }

  restore(item: any) {
    this.onRestore.emit(item);
  }

  onHistoryPayroll(item: any) {
    this.onHisPayroll.emit(item);
  }

  onEmployee(item: any) {
    this.onProfile.emit(item);
  }

  payroll(item: any) {
    this.onPayroll.emit(item);
  }

  overtime(item: any) {
    this.onOvertime.emit(item);
  }

  onListPosition(item: any) {
    this.onPositions.emit(item);
  }
}
