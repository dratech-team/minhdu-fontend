import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ItemContextMenu } from '@minhdu-fontend/enums';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-mouse-right',
  templateUrl: './mouse-right.component.html',
  styleUrls: ['./mouse-right.component.scss']
})
export class MouseRightComponent {
  item: any;
  @ViewChild('menu') menu: any;

  @Input() items?: ItemContextMenu[];

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
  @Output() onCancel = new EventEmitter();
  @Output() onPrint = new EventEmitter();

  ItemContextMenu = ItemContextMenu;

  constructor(private readonly nzContextMenuService: NzContextMenuService) {
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, this.menu);
    this.item = item;
    $event.preventDefault();
    $event.stopPropagation();
  }

  add(): void {
    this.onAdd.emit(this.item);
  }

  delete(): void {
    this.onDel.emit(this.item);
  }

  update() {
    this.onUpdate.emit(this.item);
  }

  permanentlyDeleted(): void {
    this.onDelPerm.emit(this.item);
  }

  readAndUpdate(): void {
    this.onDetail.emit(this.item);
  }

  onPayment(): void {
    this.onPay.emit(this.item);
  }

  onDelivered() {
    this.onEnd.emit(this.item);
  }

  restore() {
    this.onRestore.emit(this.item);
  }

  onHistoryPayroll() {
    this.onHisPayroll.emit(this.item);
  }

  onEmployee() {
    this.onProfile.emit(this.item);
  }

  payroll() {
    this.onPayroll.emit(this.item);
  }

  overtime() {
    this.onOvertime.emit(this.item);
  }

  onListPosition() {
    this.onPositions.emit(this.item);
  }

  cancel() {
    this.onCancel.emit(this.item);
  }

  print() {
    this.onPrint.emit(this.item);
  }
}
