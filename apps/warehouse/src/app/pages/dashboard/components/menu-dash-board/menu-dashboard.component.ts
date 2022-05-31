import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'minhdu-fontend-menu-dashboard',
  templateUrl: 'menu-dashboard.component.html'
})
export class MenuDashboardComponent {
  @Input() description!: string
  @Input() title!: string
  @Input() titleButton!: string
  @Input() icon!: string
  @Input() mainColor!: string
  @Output() eventClickButton = new EventEmitter()

  onClickMenu() {
    this.eventClickButton.emit()
  }
}
