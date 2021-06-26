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
  public onContextMenu($event: MouseEvent, item: any): void {
    console.log(item);
    this.contextMenuService.show.next({
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  add( item: any): void {
    this.addEvent.emit(item);
  }

  delete( item: any): void {
    this.deleteEvent.emit(item);
  }
  readAndUpdate(item : any): void {
    this.readAndUpdateEvent.emit(item);
  }
}
