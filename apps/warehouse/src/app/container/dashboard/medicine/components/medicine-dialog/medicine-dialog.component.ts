import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MedicineAction } from '../../+state/medicine.action';
import { UnitMedicineConstant } from '../../../../../../../../../libs/constants/unit-medicine.constant';

@Component({
  templateUrl: 'medicine-dialog.component.html'
})
export class MedicineDialogComponent implements OnInit {
  formGroup!: FormGroup;
  medicineConstant = UnitMedicineConstant
  numberChars = new RegExp('[^0-9]', 'g');
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      barcode: [this?.data?.barcode, Validators.required],
      code: [this?.data?.code, Validators.required],
      name: [this?.data?.name, Validators.required],
      provider: [this?.data?.provider, Validators.required],
      expire: [
        this.datePipe.transform(
          this?.data?.expire, 'yyyy-MM-dd'
        )
        , Validators.required],
      price: [this?.data?.price, Validators.required],
      discount: [this?.data?.discount ? this.data.discount * 100: undefined , Validators.required],
      invoice: [this?.data?.invoice, Validators.required],
      unit: [this?.data?.unit, Validators.required],
      amount: [this?.data?.amount, Validators.required],
      createdAt: [
        this.datePipe.transform(
          this?.data?.createdAt, 'yyyy-MM-dd'
        )
        , Validators.required],
    });
  }

  onSubmit() {
    const value = this.formGroup.value;
    const medicine = {
      code: value?.code,
      barcode: value?.barcode ,
      name: value.name,
      provider: value.provider,
      expire: value.expire,
      price: typeof(value.price) === 'string'?Number(value.price.replace(this.numberChars, '')): value.price ,
      discount: value?.discount? value.discount/100: undefined,
      createdAt: value.createdAt,
      invoice: value?.invoice,
      amount: value.amount,
      unit: value?.unit,
    };
    if (this.data) {
      this.store.dispatch(MedicineAction.updateMedicine({ medicine: medicine, id: this.data.id }));
    } else {
      this.store.dispatch(MedicineAction.addMedicine({ medicine: medicine }));
    }

  }
}


