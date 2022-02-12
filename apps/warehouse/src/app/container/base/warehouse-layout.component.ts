import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthActions } from '@minhdu-fontend/auth';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { Role } from 'libs/enums/hr/role.enum';
import { Router } from '@angular/router';

@Component({
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss']
})
export class WarehouseLayoutComponent implements OnInit, AfterContentChecked {
  role = localStorage.getItem('role');
  roleEnum = Role;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router,
    private readonly ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    if (!this.role) {
      this.router.navigate(['/']).then();
    }
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  logout() {
    const ref = this.dialog.open(LogoutComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(AuthActions.logout());
      }
    });
  }

  signUp() {
    this.dialog.open(RegisterComponent, { width: '40%' });
  }
}
