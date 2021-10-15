import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { HolidayAction } from '../../+state/holiday/holiday.action';
import { AddHolidayComponent } from '../../component/add-holiday/add-holiday.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { AppState } from 'apps/hr/src/app/reducers';
import { selectHolidayAdding, selectHolidayLoaded, selectorAllHoliday } from '../../+state/holiday/holiday.selector';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { ConvertBoolean } from '@minhdu-fontend/enums';


@Component({
  templateUrl: 'holiday.component.html'
})
export class HolidayComponent implements OnInit {
  adding$ = this.store.pipe(select(selectHolidayAdding))
  convertBoolean = ConvertBoolean
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      datetime: new FormControl(''),
      rate: new FormControl(''),
      position: new FormControl(''),
      isConstraint: new FormControl(''),
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }

  holidays$ = this.store.pipe(select(selectorAllHoliday));
  loaded$ = this.store.pipe(select(selectHolidayLoaded));

  ngOnInit() {
    this.store.dispatch(HolidayAction.LoadInit({ take: this.pageSize, skip: this.pageIndexInit }));
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
      data: $event,
      panelClass: 'ccc',
      backdropClass: 'ggg',
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
      HolidayAction.LoadMoreHoliday(
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
      position: val.position,
      datetime: val.datetime
    };
  }
}
