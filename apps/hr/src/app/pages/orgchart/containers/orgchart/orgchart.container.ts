import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { DialogOrgChartComponent } from '../../components/dialog/dialog-org-chart.component';
import { DialogDeleteComponent } from '../../components/dialog-delete/dialog-delete.component';
import { DepartmentActions } from 'libs/orgchart/src/lib/+state/department';
import { PositionActions } from 'libs/orgchart/src/lib/+state/position';

@Component({
  templateUrl: 'orgchart.container.html',
  styleUrls: ['orgchart.container.scss']
})
export class OrgchartContainer implements OnInit {
  orgchart$ = this.store.pipe(select(getAllOrgchart));
  type = OrgchartEnum;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
  }

  openDialog(title: string, type?: string, isEdit?: boolean, data?: any): void {
    const dialogRef = this.dialog.open(DialogOrgChartComponent, {
      width: '40%',
      data: { title, type, isEdit, data }
    });
    dialogRef.afterClosed().subscribe(
      (value) => {
        if (value.name !== undefined) {
          if (type === this.type.DEPARTMENT) {
            if (isEdit) {
              this.store.dispatch(DepartmentActions.updateDepartment({ name: value.name, id: value.id }));
            } else {
              this.store.dispatch(DepartmentActions.addDepartment({
                department: {
                  name: value.name,
                  branchId: value.branchId
                }
              }));
            }
          }
          if (type === this.type.BRANCH) {
            if (isEdit) {
              this.store.dispatch(OrgchartActions.updateBranch({ id: value.id, name: value.name }));
            } else {
              this.store.dispatch(OrgchartActions.addBranch({ branch: { name: value.name } }));
            }
          }
          if (type === this.type.POSITION) {
            if (isEdit) {
              this.store.dispatch(PositionActions.updatePosition(
                { id: value.id, name: value.name, workday: value.workday }));
            } else {
              this.store.dispatch(PositionActions.addPosition(
                { position: { name: value.name, departmentId: value.id, workday: value.workday } }));
            }
          }
        }
      }
    );
  }

  openDialogDelete(title: string, type: string, id: any): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '30%',
      data: { title }
    });
    dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          if (type === this.type.BRANCH) {
            this.store.dispatch(OrgchartActions.deleteBranch({ id: id }));
          }
          if (type === this.type.DEPARTMENT) {
            this.store.dispatch(DepartmentActions.deleteDepartment({ id: id }));
          }
          if (type === this.type.POSITION) {
            this.store.dispatch(PositionActions.deletePosition({ id: id }));
          }
        }
      }
    );
  }
}
