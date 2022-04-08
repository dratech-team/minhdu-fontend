import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {ProductActions} from '../../state/product.actions';
import {ProductQuery} from '../../state/product.query';
import {CategoryAction, CategoryQuery} from '../../../category/state';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ProductStore} from '../../state/product.store';
import {Store} from "@ngrx/store";
import {getAllOrgchart, OrgchartActions} from "@minhdu-fontend/orgchart";
import {SupplierQuery} from "../../../supplier/state";
import {ProductDialogComponent} from "../../components";

@Component({
  selector: 'minhdu-fontend-product',
  templateUrl: 'product.component.html'
})
export class ProductComponent implements OnInit {
  categories$ = this.categoryQuery.selectAll()
  supplier$ = this.supplierQuery.selectAll()
  branches$ = this.store.select(getAllOrgchart)
  products$ = this.productQuery.selectAll();
  loading$ = this.productQuery.selectLoading();
  stateSearch = this.productQuery.getValue().search;
  formGroup = new FormGroup(
    {
      search: new FormControl(''),
      branch: new FormControl(this.stateSearch?.branches||''),
      category: new FormControl(this.stateSearch?.category||''),
      supplier: new FormControl(this.stateSearch?.supplier||''),
    }
  );
  panelOpenState = false;
  pageSizeTable = 10;
  visible = false;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly categoryQuery: CategoryQuery,
    private readonly supplierQuery: SupplierQuery,
    private readonly store: Store,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly productStore: ProductStore
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init())
    this.actions$.dispatch(ProductActions.loadAll({
      search: this.mapProduct(this.formGroup.value, false)
    }));

    this.actions$.dispatch(CategoryAction.loadAll());

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(ProductActions.loadAll({
            search: this.mapProduct(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.productQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(ProductActions.loadAll({
        search: this.mapProduct(this.formGroup.value, true),
        isPaginate: true
      }));
    }
  }

  mapProduct(dataFG: any, isPagination: boolean) {
    this.productStore.update(state => ({
      ...state, search: dataFG
    }));
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.productQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  onAdd() {
    this.modal.create({
      nzWidth:'fit-content',
      nzTitle: 'Tạo sản phẩm',
      nzContent: ProductDialogComponent,
      nzFooter: null,
    })
  }
}
