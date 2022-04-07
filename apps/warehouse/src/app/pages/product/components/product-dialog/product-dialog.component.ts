import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {Actions} from '@datorama/akita-ng-effects';
import {AppState} from '../../../../reducers';
import {CategoryAction, CategoryQuery} from '../../../category/state';
import {SupplierActions, SupplierQuery} from '../../../supplier/state';
import {ProductEntity} from "../../entities";
import {ProductActions} from "../../state/product.actions";
import {CategoryUnitConstant} from "../../../../../shared/constant";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ProductQuery} from "../../state/product.query";
import {Branch} from "@minhdu-fontend/data-models";
import {BaseProductEntity} from "../../bases";
import {BaseAddProductDto} from "../../dto";
import {TypeProductEnum} from "../../enums";

@Component({
  templateUrl: 'product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {
  @Input() data?: { product: ProductEntity, isUpdate?: boolean }
  branches$ = this.store.select(getAllOrgchart);
  categories$ = this.categoryQuery.selectAll();
  supplier$ = this.supplierQuery.selectAll()
  added$ = this.productQuery.select(state => state.added)
  categoryUnitConstant = CategoryUnitConstant
  formGroup!: FormGroup
  typeProductEnum = TypeProductEnum
  constructor(
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly categoryQuery: CategoryQuery,
    private readonly supplierQuery: SupplierQuery,
    private readonly productQuery: ProductQuery,
    private readonly action$: Actions,
    private readonly modelRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.action$.dispatch(SupplierActions.loadAll({search:{take: 30, skip: 0}}));
    this.action$.dispatch(CategoryAction.loadAll());
    if (this.data?.product) {
      this.formGroup = this.formBuilder.group({
        name: [this.data.product.name, Validators.required],
        code: [this.data.product?.code, Validators.required],
        category: [this.data.product.category],
        supplier: [this.data.product.supplier],
        branches: [this.data.product?.branches],
        unit: [this.data.product.unit, Validators.required],
        barcode: [this.data.product.barcode],
        amount:[''],
        type:[this.data.product.type,Validators.required]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        supplier: [''],
        category: [''],
        branches: [[]],
        unit: ['', Validators.required],
        barcode: [''],
        amount: [''],
        type: [TypeProductEnum.NORMAL, Validators.required]
      });
    }
    console.log(this.checkValid)
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const product : BaseAddProductDto = {
      name: value.name,
      categoryId: value.category.id,
      branchIds: value.branches.map((branch:Branch )=> branch.id),
      code: value.barcode,
      unit: value.unit,
      note: value.note,
      supplierId: value.supplier.id,
      type: value.type,
      amount:value.amount
    }
    if (this.data?.isUpdate) {
      this.action$.dispatch(SupplierActions.update({id: this.data.product.id, updates: product}));
    } else {
      this.action$.dispatch(ProductActions.addOne({body: product}));
    }
    this.added$.subscribe(added => {
      if (added) {
        this.modelRef.close()
      }
    })
  }
}


