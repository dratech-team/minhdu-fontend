import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'minhdu-fontend-item-user-manual-dashboard',
  templateUrl: 'item-user-manual-dashboard.component.html',
})
export class ItemUserManualDashboardComponent {
  @Input() description!: string;
  @Input() title!: string;
  @Input() readingTime!: number;
  @Output() eventClickItem = new EventEmitter();

  onClickItem() {
    this.eventClickItem.emit();
  }
}
