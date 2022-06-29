import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ContextMenuService } from 'ngx-contextmenu';
import { ItemContextMenu } from '../../../../enums/sell/page-type.enum';

@Component({
  selector: 'app-mouse-right-chip-position',
  templateUrl: './mouse-right-chip-position.component.html',
})
export class MouseRightChipPositionComponent {
  @Output() Employee = new EventEmitter();
  @Output() payroll = new EventEmitter();
  @Output() overtime = new EventEmitter();

  constructor(private contextMenuService: ContextMenuService) {}

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
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
}
