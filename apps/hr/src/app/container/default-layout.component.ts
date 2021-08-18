import { Component } from '@angular/core';
import { navItems } from './_nav';
import { Store } from '@ngrx/store';
import { AuthActions } from '@minhdu-fontend/auth';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from '../../../../../libs/auth/src/lib/components/logout.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  showFiller = false;
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e: any): void {
    this.sidebarMinimized = e;
  }

  logout() {
  const ref = this.dialog.open(LogoutComponent,{width:'30%'});
  ref.afterClosed().subscribe(val =>
  {
    if(val){
      this.store.dispatch(AuthActions.logout());
    }
  })
  }
}
