import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEntity } from '../../entities';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { DialogDeleteComponent } from '@minhdu-fontend/components';
import { ProductActions } from '../../state/product.actions';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@datorama/akita-ng-effects';
import { ConsignmentEntity } from '../../../consignment/entities';
import { ProductQuery } from '../../state/product.query';

@Component({
  selector: 'minhdu-fontend-table-product',
  templateUrl: 'table-product.component.html',
})
export class TableProductComponet {
  @Input() products: ProductEntity[] = [];
  @Input() loading = false;
  @Input() pageSize = 7;
  @Input() multiple = false;
  @Output() pageIndexChange = new EventEmitter<number>();
  ui$ = this.productQuery.select((state) => state.ui);
  checked = false;
  indeterminate = false;
  currentPageData: readonly ConsignmentEntity[] = [];
  idsSelected = new Set<number>();

  constructor(
    private readonly modal: NzModalService,
    private readonly dialog: MatDialog,
    private actions$: Actions,
    private productQuery: ProductQuery
  ) {}

  onPageIndexChange(index: number) {
    this.pageIndexChange.emit(index);
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Tạo sản phẩm',
      nzContent: ProductDialogComponent,
      nzFooter: null,
    });
  }

  onDelete($event: any) {
    this.dialog
      .open(DialogDeleteComponent, { width: '30%' })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.actions$.dispatch(ProductActions.remove({ id: $event.id }));
        }
      });
  }

  onUpdate(product: ProductEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật sản phẩm',
      nzContent: ProductDialogComponent,
      nzComponentParams: {
        data: {
          isUpdate: true,
          product: product,
        },
      },
      nzFooter: null,
    });
  }

  onAllChecked(checked: boolean): void {
    this.currentPageData.forEach(({ id }) =>
      this.updateCheckedSet(id, checked)
    );
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.idsSelected.add(id);
    } else {
      this.idsSelected.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.currentPageData.every(({ id }) =>
      this.idsSelected.has(id)
    );
    this.indeterminate =
      this.currentPageData.some(({ id }) => this.idsSelected.has(id)) &&
      !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
}
