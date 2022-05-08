import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {
  BranchActions,
  BranchEntity,
  BranchQuery, BranchStore,
  PositionActions,
  PositionEntity,
  PositionQuery,
  PositionStore
} from "@minhdu-fontend/orgchart-v2";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";
import {Router} from "@angular/router";
import {PayrollStore} from "../../../../payroll/state";
import {EmployeeStore} from "@minhdu-fontend/employee-v2";
import {FilterTypeEnum, ItemContextMenu} from "@minhdu-fontend/enums";
import {ModalBranchComponent} from "../../components/modal-branch/modal-branch.component";
import {DataAddOrUpBranch} from "../../data/modal-department.data";

@Component({
  templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
  branches$ = this.branchQuery.selectAll()
  loading$ = this.branchQuery.select(state => state.loading)
  total$ = this.branchQuery.select(state => state.total)
  positions$ = this.positionQuery.selectAll()

  pageSizeTable = 10;
  filterType = FilterTypeEnum
  itemContextMenu = ItemContextMenu
  stateSearch = this.branchQuery.getValue().search
  formGroup = new FormGroup(
    {
      search: new FormControl(this.stateSearch.name),
      position: new FormControl(this.stateSearch.position|| ''),
    }
  );

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly branchQuery: BranchQuery,
    private readonly branchStore: BranchStore,
    private readonly payrollStore: PayrollStore,
    private readonly employeeStore: EmployeeStore,
    private readonly positionStore: PositionStore,
    private readonly positionQuery: PositionQuery,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(PositionActions.loadAll({}))
    this.actions$.dispatch(BranchActions.loadAll({
      search: this.mapBranch(this.formGroup.value, false)
    }));

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(BranchActions.loadAll({
            search: this.mapBranch(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.branchQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(BranchActions.loadAll({
        search: this.mapBranch(this.formGroup.value, true),
        isPaginate: true
      }));
    }
  }

  mapBranch(dataFG: any, isPagination: boolean) {
    this.branchStore.update(state => ({
      ...state, search: dataFG
    }))
    return Object.assign({}, dataFG, {
      position: dataFG.position.name,
      take: PaginationDto.take,
      skip: isPagination ? this.branchQuery.getCount() : PaginationDto.skip
    });
  }

  onAdd() {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'Thêm đơn vị',
      nzContent: ModalBranchComponent,
      nzFooter: []
    })
  }

  onUpdate(branch: BranchEntity) {
    this.modal.create({
      nzWidth: '30vw',
      nzTitle: 'Cập nhật đơn vị',
      nzContent: ModalBranchComponent,
      nzComponentParams: <{ data?: DataAddOrUpBranch }>{
        data: {
          update: {
            branch: branch
          }
        }
      },
      nzFooter: []
    })
  }

  onDelete(branch: BranchEntity) {
    this.modal.create({
      nzTitle: `Xoá đơn vị ${branch.name}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá đơn vị ${branch.name} này không`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(BranchActions.remove({id: branch.id}))
      }
    })
  }

  onEmployee(branch: BranchEntity) {
    this.positionStore.add(branch.positions || [])
    this.employeeStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(state.search)), {branch: branch})
    }))
    this.router.navigate(['nhan-vien']).then();
  }

  onDetail(branch: BranchEntity) {
    this.router.navigate(['to-chuc/don-vi/chi-tiet-don-vi/', branch.id]).then();
  }

  onEmployeePosition(item: { position: PositionEntity, branch: BranchEntity }) {
    this.positionStore.add(item.branch.positions || [])
    this.employeeStore.update(state => ({
      ...state,
      search: Object.assign(JSON.parse(JSON.stringify(state.search)),
        {position: item.position, branch: item.branch})
    }))
    this.router.navigate(['nhan-vien']).then();
  }

  onPayrollPosition(item: { position: PositionEntity, branch: BranchEntity }, filterType: FilterTypeEnum) {
    this.positionStore.add(item.branch.positions || [])

    this.payrollStore.update(state => ({
      ...state, search: Object.assign(JSON.parse(JSON.stringify(state.search)), {
        position: item.position,
        branch: item.branch,
        filterType: filterType
      })
    }))
    this.router.navigate(['phieu-luong']).then();
  }

}
