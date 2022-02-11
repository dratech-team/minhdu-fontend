import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { UnitMedicineConstant } from '@minhdu-fontend/constants';
import { addBranch, getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { AppState } from '../../../../../reducers';
import { searchAndAddAutocomplete } from '@minhdu-fontend/utils';
import { startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { WarehouseQuery } from '../../state/warehouse/warehouse.query';
import { Actions } from '@datorama/akita-ng-effects';
import { ProductQuery } from '../../state/product/product.query';

@Component({
  templateUrl: 'product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {
  branches$ = this.store.select(getAllOrgchart);
  warehouse$ = this.warehouseQuery.selectAll();

  medicineConstant = UnitMedicineConstant;
  warehouseId = this.warehouseQuery.getValue().selected;

  formGroup = this.formBuilder.group({
    barcode: [this.data?.barcode, Validators.required],
    branch: [this.data?.branchId],
    warehouse: [this.warehouseQuery.getEntity(this.warehouseId)?.name],
    code: [this.data?.code, Validators.required],
    name: [this.data?.name, Validators.required],
    provider: [this.data?.provider, Validators.required],
    expire: [
      this.datePipe.transform(
        this?.data?.expire, 'yyyy-MM-dd'
      )
      , Validators.required],
    price: [this?.data?.price, Validators.required],
    discount: [this?.data?.discount ? this.data.discount * 100 : undefined, Validators.required],
    invoice: [this?.data?.invoice, Validators.required],
    unit: [this?.data?.unit || UnitMedicineConstant[1].value, Validators.required],
    amount: [this?.data?.amount, Validators.required],
    createdAt: [
      this.datePipe.transform(
        this?.data?.createdAt || new Date(), 'yyyy-MM-dd'
      )
      , Validators.required]
  });

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly warehouseQuery: WarehouseQuery,
    private readonly productQuery: ProductQuery,
    private readonly action$: Actions
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());

    this.branches$ = searchAndAddAutocomplete(
      this.formGroup.get('branch')?.valueChanges?.pipe(startWith('')) || of(''),
      this.branches$
    );
  }

  onSubmit() {
    const value = this.formGroup.value;
    console.log(value);
    const medicine = {
      code: value?.code,
      barcode: value?.barcode,
      name: value.name,
      provider: value.provider,
      expire: value.expire,
      price: value.price,
      discount: value?.discount ? value.discount / 100 : undefined,
      createdAt: value.createdAt,
      invoice: value?.invoice,
      amount: value.amount,
      unit: value?.unit
    };
    if (this.data?.isUpdate) {
      // this.store.dispatch(MedicineAction.updateMedicine({ medicine: medicine, id: this.data.id }));
    } else {
      // this.store.dispatch(MedicineAction.addMedicine({ medicine: medicine }));
    }
  }

  onChangeBranch(event: any, branch: any) {
    const value = this.formGroup.get('branch')?.value;
    if (!branch?.id) {
      this.store.dispatch(addBranch({ branch: { name: value } }));
      this.formGroup.get('branch')?.setValue(value);
    } else {
      this.formGroup.get('branch')?.patchValue(branch.name);
    }
  }

  onChangeWarehouse(event: any, branch: any) {
    const value = this.formGroup.get('warehouse')?.value;
    if (!branch?.id) {
      this.store.dispatch(addBranch({ branch: { name: value } }));
      this.formGroup.get('branch')?.setValue(value);
    } else {
      this.formGroup.get('branch')?.patchValue(branch.name);
    }
  }
}


