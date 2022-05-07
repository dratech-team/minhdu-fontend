import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DepartmentActions, DepartmentQuery} from "@minhdu-fontend/orgchart-v2";
import {ModalDepartmentComponent} from "../../components/modal-department/modal-department.component";
import {DataAddOrUpdateDepartment} from "../../data/modal-department.data";
import {DepartmentEntity} from "@minhdu-fontend/orgchart-v2";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "@minhdu-fontend/base-entity";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'department.component.html'
})
export class DepartmentComponent implements OnInit {
  departments$ = this.departmentQuery.selectAll()
  loading$ = this.departmentQuery.select('loading')
  total$ = this.departmentQuery.select('total')
  pageSizeTable = 10;

  formGroup = new FormGroup(
    {
      search: new FormControl(''),
    }
  );

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly departmentQuery: DepartmentQuery,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(DepartmentActions.loadAll({
      search: this.mapDepartment(this.formGroup.value, false)
    }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(DepartmentActions.loadAll({
            search: this.mapDepartment(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.departmentQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(DepartmentActions.loadAll({
        search: this.mapDepartment(this.formGroup.value, true),
        isPaginate: true
      }));
    }
  }

  mapDepartment(dataFG: any, isPagination: boolean) {
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.departmentQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  onAdd(department?: DepartmentComponent) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Tạo phòng ban',
      nzContent: ModalDepartmentComponent,
      nzComponentParams: <{ data?: DataAddOrUpdateDepartment }>{
        data: {
          add: {
            category: department
          }
        }
      },
      nzFooter: [],
    })
  }

  onUpdate(department: DepartmentEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật phòng ban',
      nzContent: ModalDepartmentComponent,
      nzComponentParams: <{ data?: DataAddOrUpdateDepartment }>{
        data: {
          update: {
            department: department
          }
        }
      },
      nzFooter: [],
    })
  }

  onDelete(department: DepartmentEntity) {
    this.modal.create({
      nzTitle: `Xoá phòng ban ${department.name}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có chắc chắn muốn xoá phòng ban ${department.name} này không`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(DepartmentActions.remove({id: department.id}))
      }
    })
  }

  onEmployee(department: DepartmentEntity) {
    this.router.navigate(['nhan-vien'], {
      queryParams: {
        departmentId: department.id
      }
    }).then();
  }
}
