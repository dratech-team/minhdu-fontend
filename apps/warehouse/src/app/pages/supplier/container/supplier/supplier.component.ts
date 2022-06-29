import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { debounceTime } from 'rxjs/operators';
import { SupplierEntity } from '../../entities';
import { SupplierActions, SupplierQuery } from '../../state';
import { DialogSupplierComponent } from '../../components';
import { Actions } from '@datorama/akita-ng-effects';
import { BaseSearchSupplierDto } from '../../dto';
import { PaginationDto } from '@minhdu-fontend/constants';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: 'supplier.component.html',
})
export class SupplierComponent implements OnInit {
  supplier$ = this.supplierQuery.selectAll();
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(),
    startedAt: new UntypedFormControl(),
    endedAt: new UntypedFormControl(),
  });
  total$ = this.supplierQuery.selectCount();
  loading$ = this.supplierQuery.select((state) => state.loading);
  pageSize = 10;

  constructor(
    private readonly actions$: Actions,
    public readonly supplierQuery: SupplierQuery,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService
  ) {}

  ngOnInit() {
    this.actions$.dispatch(
      SupplierActions.loadAll({ search: { take: 30, skip: 0 } })
    );
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      this.actions$.dispatch(
        SupplierActions.loadAll({
          search: this.mapSupplier(false),
        })
      );
    });
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Thêm nhà cung cấp',
      nzContent: DialogSupplierComponent,
      nzFooter: null,
    });
  }

  onUpdate(supplier: SupplierEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Thêm nhà cung cấp',
      nzContent: DialogSupplierComponent,
      nzComponentParams: {
        data: {
          supplier: supplier,
          isUpdate: true,
        },
      },
      nzFooter: null,
    });
  }

  deleteProvider(provider: SupplierEntity) {
    this.dialog
      .open(DialogSharedComponent, {
        width: 'fit-content',
        data: {
          title: 'Xoá nhà cung cấp',
          description: `bạn có muốn xoá nhà cung cấp ${provider.name}`,
        },
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.actions$.dispatch(SupplierActions.remove({ id: provider.id }));
        }
      });
  }

  mapSupplier(isPagination: boolean): BaseSearchSupplierDto {
    return Object.assign({}, this.formGroup.value, {
      take: PaginationDto.take,
      skip: isPagination ? this.supplierQuery.getCount() : PaginationDto.skip,
    }) as BaseSearchSupplierDto;
  }

  onPagination(index: number) {
    if (index * this.pageSize >= this.supplierQuery.getCount()) {
      this.actions$.dispatch(
        SupplierActions.loadAll({
          search: this.mapSupplier(true),
          isPaginate: true,
        })
      );
    }
  }
}
