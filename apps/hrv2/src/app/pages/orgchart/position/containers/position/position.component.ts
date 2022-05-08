import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DepartmentActions, PositionActions, PositionEntity, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";
import {Router} from "@angular/router";
import {ModalPositionComponent} from "../../components/modal-position/modal-position.component";
import {DataAddOrUpdatePosition} from "../../data/modal-position.data";
import {FilterTypeEnum, ItemContextMenu} from "@minhdu-fontend/enums";
import {EmployeeStore} from "@minhdu-fontend/employee-v2";
import {PayrollStore} from "../../../../payroll/state";

@Component({
  templateUrl: 'position.component.html'
})
export class PositionComponent implements OnInit {
  positions$ = this.positionQuery.selectAll()
  loading$ = this.positionQuery.select(state => state.loading)
  total$ = this.positionQuery.select(state => state.total)

  pageSizeTable = 10;
  stateSearch = this.positionQuery.getValue().search
  itemContextMenu = ItemContextMenu
  filterType = FilterTypeEnum

  formGroup = new FormGroup(
    {
      search: new FormControl(this.stateSearch.search),
    }
  );

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly positionQuery: PositionQuery,
    private readonly employeeStore: EmployeeStore,
    private readonly payrollStore: PayrollStore,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({
      search: this.mapPosition(this.formGroup.value, false)
    }));

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(DepartmentActions.loadAll({
            search: this.mapPosition(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.positionQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(DepartmentActions.loadAll({
        search: this.mapPosition(this.formGroup.value, true),
        isPaginate: true
      }));
    }
  }

  mapPosition(dataFG: any, isPagination: boolean) {
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.positionQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Tạo phòng ban',
      nzContent: ModalPositionComponent,
      nzFooter: []
    })
  }

  onUpdate(position: PositionEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật chức vụ',
      nzContent: ModalPositionComponent,
      nzComponentParams: <{ data?: DataAddOrUpdatePosition }>{
        data: {
          update: {
            position: position
          }
        }
      },
      nzFooter: []
    })
  }

  onDelete(position: PositionEntity) {
    this.modal.create({
      nzTitle: `Xoá chức vụ ${position.name}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá chức vụ ${position.name} này không`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(PositionActions.remove({id: position.id}))
      }
    })
  }

  onEmployee(position: PositionEntity) {
    this.employeeStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(state.search)), {
        position: position
      })
    }))
    this.router.navigate(['nhan-vien']).then();
  }

  onPayroll(position: PositionEntity, filterType: FilterTypeEnum) {
    this.payrollStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(state.search)), {
        position: position,
        filterType: filterType
      })
    }))
    this.router.navigate(['phieu-luong']).then();
  }
}
