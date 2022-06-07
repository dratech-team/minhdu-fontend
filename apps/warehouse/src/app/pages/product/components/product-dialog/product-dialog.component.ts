import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Actions} from '@datorama/akita-ng-effects';
import {WarehouseAction, WarehouseQuery} from '../../../warehouse/state';
import {SupplierActions, SupplierQuery} from '../../../supplier/state';
import {ProductEntity} from "../../entities";
import {ProductActions} from "../../state/product.actions";
import {CategoryUnitConstant} from "../../../../../shared/constant";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ProductQuery} from "../../state/product.query";
import {Branch} from "@minhdu-fontend/data-models";
import {BaseAddProductDto} from "../../dto";
import {TypeProductEnum} from "../../enums";
import {BranchActions, BranchQuery} from "@minhdu-fontend/orgchart-v2";

@Component({
  templateUrl: 'product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {
  @Input() data?: { product: ProductEntity, isUpdate?: boolean }
  branches$ = this.branchQuery.selectAll();
  warehouses$ = this.categoryQuery.selectAll();
  supplier$ = this.supplierQuery.selectAll()
  loading$ = this.productQuery.select(state => state.loading)
  categoryUnitConstant = CategoryUnitConstant
  formGroup!: FormGroup
  typeProductEnum = TypeProductEnum

  constructor(
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly categoryQuery: WarehouseQuery,
    private readonly supplierQuery: SupplierQuery,
    private readonly productQuery: ProductQuery,
    private readonly action$: Actions,
    private readonly modelRef: NzModalRef,
    private readonly branchQuery: BranchQuery
  ) {
  }

  ngOnInit() {
    this.action$.dispatch(BranchActions.loadAll({}));
    this.action$.dispatch(SupplierActions.loadAll({search: {take: 30, skip: 0}}));
    this.action$.dispatch(WarehouseAction.loadAll());
    if (this.data?.product) {
      this.formGroup = this.formBuilder.group({
        name: [this.data.product.name, Validators.required],
        code: [this.data.product?.code, Validators.required],
        category: [this.data.product.category],
        supplier: [this.data.product.supplier],
        branches: [this.data.product?.branches],
        unit: [this.data.product.unit, Validators.required],
        barcode: [this.data.product.barcode],
        amount: [''],
        type: [this.data.product.type, Validators.required]
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
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const product: BaseAddProductDto = {
      name: value.name,
      categoryId: value.category.id,
      branchIds: value.branches.map((branch: Branch) => branch.id),
      code: value.barcode,
      unit: value.unit,
      note: value.note,
      supplierId: value.supplier.id,
      type: value.type,
      amount: value.amount
    }
    if (this.data?.isUpdate) {
      this.action$.dispatch(SupplierActions.update({id: this.data.product.id, updates: product}));
    } else {
      this.action$.dispatch(ProductActions.addOne({body: product}));
    }
    this.loading$.subscribe(loading => {
      if (loading === false) {
        this.modelRef.close()
      }
    })
  }
}


