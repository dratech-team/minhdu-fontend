import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Route } from '../../container/+state/route.interface';
import { PickRoutesService } from './pick-routes.service';
import { RouteDialogComponent } from '../route-dialog/route-dialog.component';


@Component({
  selector: 'app-pick-routes',
  templateUrl: 'pick-routes.component.html'
})
export class PickRoutesComponent implements OnInit {
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter();
  pageIndex: number = 1;
  pageSize: number = 30;
  isSelectAll: boolean = false;
  routes: Route[] = [];
  routeIds: number[] = [];


  formGroup = new FormGroup(
    {
    }
  );

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PickRoutesComponent>,
    private readonly service: PickRoutesService
  ) {
  }

  ngOnInit(): void {
    this.service.loadInit();
    this.assignIsSelect();
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        const val = {
          take: 30,
          skip: 0
        };
        this.service.searchRoutes(val);
        this.assignIsSelect();
      })
    ).subscribe();
  }

  onScroll() {
    const value = this.formGroup.value;
    const val = {
      take: this.pageSize,
      skip: this.pageIndex++
    };
    this.service.scrollRoutes(val);
    this.assignIsSelect();
  }

  assignIsSelect() {
    this.service.routes().subscribe(val => {
      this.routes = JSON.parse(JSON.stringify(val));
      this.routes.forEach(e => e.isSelect = this.isSelectAll);
    });
  }


  updateAllSelect(id: number) {
    const index = this.routeIds.indexOf(id);
    if (index > -1) {
      this.routeIds.splice(index, 1);
    } else {
      this.routeIds.push(id);
    }
    this.isSelectAll = this.routes !== null && this.routes.every(e => e.isSelect);
    this.checkEvent.emit(this.routeIds);
  }

  someComplete(): boolean {
    if (this.routes == null) {
      return false;
    }
    return (
      this.routes.filter(e => e.isSelect).length > 0 && !this.isSelectAll
    );
  }


  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.routes == null) {
      return;
    }
    this.routeIds = [];
    this.routes?.forEach(customer => {
        customer.isSelect = select;
        if (select) {
          this.routeIds.push(customer.id);
        }
      }
    );
    this.checkEvent.emit(this.routeIds);
  }

  closeDialog() {
    this.dialogRef.close(this.routeIds);
  }

  addRoute() {
    this.dialog.open(RouteDialogComponent, { width: '40%' });
  }
}
