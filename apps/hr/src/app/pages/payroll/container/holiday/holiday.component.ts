import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { HolidayAction } from '../../+state/holiday/holiday.action';
import { AddHolidayComponent } from '../../component/add-holiday/add-holiday.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { AppState } from 'apps/hr/src/app/reducers';
import { selectorAllHoliday } from '../../+state/holiday/holiday.selector';
import { FormControl, FormGroup } from '@angular/forms';
import { SystemHistoryActions } from '../../../../../../../../libs/system-history/src/lib/+state/system-history.actions';
import { debounceTime, tap } from 'rxjs/operators';


@Component({
  templateUrl: 'holiday.component.html'
})
export class HolidayComponent implements OnInit {
  pageSize = 30;
  pageIndexInit = 0;
  holidays$ = this.store.pipe(select(selectorAllHoliday));
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      datetime: new FormControl(''),
      rate: new FormControl(''),
      department: new FormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(HolidayAction.LoadAllHoliday());
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            HolidayAction.LoadInit(this.template(val))
          );
        })
      )
      .subscribe();
  }

  Holiday($event?: any) {
    const dialogRef = this.dialog.open(AddHolidayComponent, {
      width: '35%',
      data: $event
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        if (val.isUpdate) {
          this.store.dispatch(HolidayAction.UpdateHoliday({ id: val.id, holiday: val.data }));
        } else {
          this.store.dispatch(HolidayAction.AddHoliday({ holiday: val.data }));
        }
      }
    });
  }

  deleteHoliday($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(HolidayAction.DeleteHoliday({ id: $event.id }));
        }
      }
    );
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      SystemHistoryActions.loadMoreSystemHistory(
        this.template(val)
      )
    );
  }

  template(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      name: val.name,
      rate: val.rate,
      department: val.department,
      price: val.price
    };
  }
}
