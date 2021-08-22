import { Component, OnDestroy, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { Store } from '@ngrx/store';
import { AuthActions } from '@minhdu-fontend/auth';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { Role } from 'libs/enums/hr/role.enum';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  roleEnum = Role;
  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
  console.log(this.role)
    if(!this.role){

      this.router.navigate(['/']).then();
    }
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

  signUp() {
    this.dialog.open(RegisterComponent, {width:'40%'})
  }

}
