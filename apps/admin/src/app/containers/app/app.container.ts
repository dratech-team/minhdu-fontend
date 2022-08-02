import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { AccountQuery } from '../../../../../../libs/system/src/lib/state/account-management/account.query';
import { map, tap } from 'rxjs/operators';

@Component({
  templateUrl: 'app.container.html',
  styleUrls: ['app.container.scss']
})
export class AppContainer {
  account = this.accountQuery.getEntity(this.accountQuery.getActiveId());
  apps$ = this.appService.getAll().pipe(
    map(res => {
      if (this.account?.role?.role !== 'SUPPER_ADMIN' && this.account?.role?.role !== 'ADMIN') {
        return res.filter(e => e.app === this.account?.role.appName);
      }
      return res;

    }),
    tap(res => {
      if (res.length === 1) {
        window.open(res[0].link, '_self', 'replace');
      }
    })
  );

  constructor(
    private readonly router: Router,
    private readonly appService: AppService,
    private readonly accountQuery: AccountQuery
  ) {
  }
}
