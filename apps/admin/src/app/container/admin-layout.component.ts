import { Component, OnInit } from '@angular/core';
import { AuthActions } from '@minhdu-fontend/auth';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector:'app-admin-layout',
  templateUrl: 'admin-layout.component.html',
  styleUrls:['admin-layout.component.scss']
})
export  class  AdminLayoutComponent implements OnInit{
  role = localStorage.getItem('role')
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    if (!this.role){
      this.router.navigate(['/']).then();
    }
  }

  changeTab(event: any) {
    const btnHeader = document.getElementsByClassName('btn-header')
    for (let i = 0; i < btnHeader.length; i++) {
      btnHeader[i].classList.remove('btn-border')
    }
    event.classList.add('btn-border')
  }
  logout(){
    const ref = this.dialog.open(LogoutComponent,{width:'30%'});
    ref.afterClosed().subscribe(val =>
    {
      if(val){
        this.store.dispatch(AuthActions.logout());
      }
    })
  }
}
