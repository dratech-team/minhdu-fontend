import { Component, OnInit } from '@angular/core';
import { ActivityType, App } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectedTotal, selectorAllSystemHistory } from '../+state/system-history.selectors';
import { SystemHistoryActions } from '../+state/system-history.actions';
import { debounceTime, tap } from 'rxjs/operators';
import { document } from 'ngx-bootstrap/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/src/lib/snackBar/snack-bar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'system-history.container.html'
})
export class SystemHistoryContainer implements OnInit {
  app = App;
  pageSize = 30;
  pageIndexInit = 0;
  totalSystemHistoryCurrent!: number;
  totalSystemHistory!: number;
  activityType = ActivityType;
  formGroup = new FormGroup({
    id: new FormControl(''),
    appName: new FormControl(''),
    name: new FormControl(''),
    activity: new FormControl(''),
    description: new FormControl(''),
    ip: new FormControl(''),
    createdAt: new FormControl('')
  });

  constructor(
    private readonly store: Store,
    private snackBar: MatSnackBar
  ) {
  }

  systemHistory$ = this.store.pipe(select(selectorAllSystemHistory));
  totalSystemHistory$ = this.store.pipe(select(selectedTotal));

  ngOnInit(): void {
    this.systemHistory$.subscribe(val => this.totalSystemHistoryCurrent = val.length);
    this.totalSystemHistory$.subscribe(val => this.totalSystemHistory = val);
    const btnRoute = document.getElementById('systemHistory');
    btnRoute?.classList.add('btn-border');
    this.store.dispatch(SystemHistoryActions.loadSystemHistory(
      { take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            SystemHistoryActions.loadSystemHistory(this.systemHistory(val, this.pageIndexInit))
          );
        })
      )
      .subscribe();

  }

  onScroll() {
    if (this.totalSystemHistoryCurrent < this.totalSystemHistory) {
      const val = this.formGroup.value;
      this.store.dispatch(
        SystemHistoryActions.loadMoreSystemHistory(
          this.systemHistory(val)
        )
      );
    }else{
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 2500,
          panelClass: ['background-snackbar'],
          data:{content: 'Đã lấy hết dữ liệu'}
        });
    }
  }

  systemHistory(val: any, pageIndexSearch?: number) {
    return {
      skip: pageIndexSearch !== undefined ? pageIndexSearch : this.totalSystemHistoryCurrent,
      take: this.pageSize,
      id: val.id,
      appName: val.appName,
      name: val.name,
      activity: val.activity,
      description: val.description,
      ip: val.ip,
      createdAt: val.createdAt
    };
  }
}
