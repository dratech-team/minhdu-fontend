import { Component, OnInit, Output, ViewChild,EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Employee } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.interface';


@Component({
  selector: 'app-mouse-right',
  templateUrl: './mouse-right.component.html',
  styleUrls: ['./mouse-right.component.scss']
})
export class MouseRightComponent implements OnInit {
  @Output() addEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() readAndUpdateEvent = new EventEmitter();
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  constructor() { }

  ngOnInit(): void {
  }
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  add(): void {
    this.addEvent.emit();
  }

  delete(): void {
    this.deleteEvent.emit();
  }
  readAndUpdate(): void {
    this.readAndUpdateEvent.emit();
  }
}
