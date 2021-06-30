import { Component } from '@angular/core';
import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  showFiller = false;
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e: any): void {
    this.sidebarMinimized = e;
  }
}
