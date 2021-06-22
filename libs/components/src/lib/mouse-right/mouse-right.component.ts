import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContextMenuService } from 'ngx-contextmenu';



@Component({
  selector: 'app-mouse-right',
  templateUrl: './mouse-right.component.html',
  styleUrls: ['./mouse-right.component.scss']
})
export class MouseRightComponent implements OnInit {
  @Output() addEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() readAndUpdateEvent = new EventEmitter();
  constructor(
    private contextMenuService: ContextMenuService
  ) { }

  ngOnInit(): void {
  }
  public onContextMenu($event: MouseEvent, item?: any): void {
    this.contextMenuService.show.next({
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
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
