import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouteEntity } from '../../../pages/route/entities';
import { RouteDialogComponent } from '../../../pages/route/component';
import { RouteActions, RouteQuery } from '../../../pages/route/state';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  selector: 'select-route',
  templateUrl: 'select-route.component.html'
})
export class SelectRouteComponent implements OnInit {
  @Input() pickPOne: boolean | undefined;
  @Input() routes: RouteEntity[] = [];
  @Output() checkEvent = new EventEmitter();

  pageIndex = 1;
  pageSize = 30;
  pageIndexInit = 0;
  isSelectAll = false;
  routeIds: number[] = [];

  formGroup = new UntypedFormGroup({});

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: any,
    private readonly dialogRef: MatDialogRef<SelectRouteComponent>,
    private readonly routeQuery: RouteQuery
  ) {
  }

  ngOnInit(): void {
    if (this.data.routes$) {
      this.data.routes$.subscribe(
        (val: RouteEntity[]) => (this.routes = JSON.parse(JSON.stringify(val)))
      );
    }
    this.formGroup.valueChanges.subscribe(formGroup => {
      this.actions$.dispatch(RouteActions.loadAll(formGroup));
    });
  }

  onScroll() {
    const value = this.formGroup.value;
    this.actions$.dispatch(
      RouteActions.loadAll({
        search: value,
        isPaginate: true
      })
    );
    this.assignIsSelect();
  }

  assignIsSelect() {
    this.routeQuery.selectAll().subscribe((val) => {
      this.routes = JSON.parse(JSON.stringify(val));
      this.routes.forEach((e) => (e.isSelect = this.isSelectAll));
    });
  }

  updateAllSelect(id: number) {
    const index = this.routeIds.indexOf(id);
    if (index > -1) {
      this.routeIds.splice(index, 1);
    } else {
      this.routeIds.push(id);
    }
    this.isSelectAll =
      this.routes !== null && this.routes.every((e) => e.isSelect);
    this.checkEvent.emit(this.routeIds);
  }

  someComplete(): boolean {
    if (this.routes == null) {
      return false;
    }
    return (
      this.routes.filter((e) => e.isSelect).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.routes == null) {
      return;
    }
    this.routeIds = [];
    this.routes?.forEach((customer) => {
      customer.isSelect = select;
      if (select) {
        this.routeIds.push(customer.id);
      }
    });
    this.checkEvent.emit(this.routeIds);
  }

  closeDialog() {
    this.dialogRef.close(this.routeIds);
  }

  addRoute() {
    this.dialog.open(RouteDialogComponent, { width: '40%' });
  }
}
