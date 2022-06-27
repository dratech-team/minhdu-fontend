import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {MatDialog} from '@angular/material/dialog';
import {HolidayAction} from '../../+state/holiday/holiday.action';
import {DialogHolidayComponent} from '../../component/dialog-holiday/dialog-holiday.component';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {AppState} from 'apps/hr/src/app/reducers';
import {
  selectHolidayAdding,
  selectHolidayLoaded,
  selectorAllHoliday,
  selectTotalHoliday
} from '../../+state/holiday/holiday.selector';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {debounceTime, startWith, tap} from 'rxjs/operators';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {checkInputNumber, searchAutocomplete} from '@minhdu-fontend/utils';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {Router} from '@angular/router';
import {Position} from '@minhdu-fontend/data-models';
import {of} from 'rxjs';


@Component({
  templateUrl: 'holiday.component.html'
})
export class HolidayComponent implements OnInit {
  convertBoolean = ConvertBoolean;
  pageSize = 30;
  pageIndexInit = 0;

  adding$ = this.store.pipe(select(selectHolidayAdding));
  total$ = this.store.pipe(select(selectTotalHoliday));
  positions$ = this.store.pipe(select(getAllPosition));
  holidays$ = this.store.pipe(select(selectorAllHoliday));
  loaded$ = this.store.pipe(select(selectHolidayLoaded));

  formGroup = new UntypedFormGroup(
    {
      name: new UntypedFormControl(''),
      datetime: new UntypedFormControl(''),
      rate: new UntypedFormControl(''),
      position: new UntypedFormControl(''),
      isConstraint: new UntypedFormControl('')
    }
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {
  }


  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(HolidayAction.LoadInit({
      holidayDTO: {take: this.pageSize, skip: this.pageIndexInit}
    }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            HolidayAction.LoadInit(
              {
                holidayDTO: this.template(val)
              }
            )
          );
        })
      )
      .subscribe();

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );
  }

  Holiday(holiday?: any) {
    this.dialog.open(DialogHolidayComponent, {
      width: '35%',
      data: {holiday, title: 'Thêm ngày lễ'},
      panelClass: 'ccc',
      backdropClass: 'ggg'
    });
  }

  updateHoliday($event?: any) {
     this.dialog.open(DialogHolidayComponent, {
      width: '35%',
      data: {holiday: $event, upDateDetail: false, isUpdate: true, title: 'Sửa ngày lễ'},
      panelClass: 'ccc',
      backdropClass: 'ggg'
    });
  }

  detailHoliday(id: number, position?: Position) {
    if (position) {
      this.store.dispatch(HolidayAction.updateStateHoliday({
        position: position.name
      }));
    }
    this.router.navigate(['ban-mau/ngay-le/chi-tiet-ngay-le', id]).then();
  }

  deleteHoliday($event: any) {

    const dialogRef = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    dialogRef.afterClosed().subscribe(val => {
        if (val) {
          this.store.dispatch(HolidayAction.DeleteHoliday({id: $event.id}));
        }
      }
    );
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      HolidayAction.LoadMoreHoliday(
        {
          holidayDTO: this.template(val)
        }
      )
    );
  }

  template(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      rate: val.rate,
      position: val.position,
      datetime: val.datetime,
      isConstraint: val.isConstraint
    };
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  checkInputNumber($event: any) {
    return checkInputNumber($event);
  }
}
