import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { HolidayAction } from '../../+state/holiday/holiday.action';
import { AddHolidayComponent } from '../../component/add-holiday/add-holiday.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { AppState } from 'apps/hr/src/app/reducers';
import { selectorAllHoliday } from '../../+state/holiday/holiday.selector';



@Component({
  templateUrl:'holiday.component.html'
})
export class HolidayComponent implements OnInit{
  holidays$ = this.store.pipe(select(selectorAllHoliday));

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>
  ) {
  }
  ngOnInit() {
    this.store.dispatch(HolidayAction.LoadAllHoliday())
  }

  Holiday($event?: any) {
    const dialogRef = this.dialog.open(AddHolidayComponent, {
      width: '30%',
      data: $event
    })
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        if (val.isUpdate) {
          this.store.dispatch(HolidayAction.UpdateHoliday({ id: val.id, holiday: val.data }));
        } else {
          this.store.dispatch(HolidayAction.AddHoliday({ holiday: val.data }));
        }
      }
    })
  }

  deleteHoliday($event: any) {

    const dialogRef = this.dialog.open(DialogDeleteComponent,{width:'30%'});
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(HolidayAction.DeleteHoliday({id:$event.id}));
        }
      }
    );
  }
}
