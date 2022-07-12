import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FilterTypeEnum } from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { ItemExportService } from './item-export.service';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ModalExportExcelData } from '../data/modal-export-excel.data';

interface itemExport {
  key: string;
  value: string;
  index: number;
}

@Component({
  templateUrl: 'modal-export-excel.component.html',
})
export class ModalExportExcelComponent implements OnInit {
  @Input() data!: ModalExportExcelData;
  formGroup!: UntypedFormGroup;
  exportType = FilterTypeEnum;
  itemsExports: itemExport[] = [];
  loading = true;
  printing = false;
  checked = false;
  indeterminate = false;
  setOfItem = new Set<itemExport>();

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly itemExportService: ItemExportService,
    private readonly exportService: ExportService,
    private readonly datePipe: DatePipe,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group(
      this.data?.typeDate === 'RANGE_DATETIME'
        ? {
            name: [this.data.filename || '', Validators.required],
            rangeDay: [
              [
                new Date(
                  this.data.params?.startedAt ||
                    this.data.params?.startedAt_start
                ),
                new Date(
                  this.data.params?.endedAt || this.data.params?.startedAt_end
                ),
              ],
            ],
          }
        : {
            name: new UntypedFormControl(
              this.data?.filename ? this.data.filename : '',
              Validators.required
            ),
            createdAt: [
              this.data.selectDatetime
                ? this.datePipe.transform(
                    new Date(
                      this.data.params?.startedAt ||
                        this.data.params?.startedAt_start
                    ),
                    'YYYY-MM'
                  )
                : '',
            ],
          }
    );

    this.itemExportService
      .getItemExport({ exportType: this.data.params.exportType })
      .subscribe((val: itemExport[]) => {
        this.loading = false;
        val?.map((e, i) => {
          Object.assign(e, { index: i });
        });
        this.itemsExports = val;
        this.onAllChecked(true);
      });
  }

  onSubmit(): any {
    this.printing = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    if (this.data?.selectDatetime) {
      if (this.data.typeDate === 'RANGE_DATETIME') {
        Object.assign(this.data.params, {
          startedAt: new Date(value.rangeDay[0]),
          endedAt: new Date(value.rangeDay[1]),
        });
      } else {
        Object.assign(this.data.params, {
          startedAt: getFirstDayInMonth(new Date(value.createdAt)),
          endedAt: getLastDayInMonth(new Date(value.createdAt)),
        });
      }
    }

    Object.assign(this.data.params, { filename: value.name });

    this.exportService
      .print(this.data.api, this.data.params, {
        items: Array.from(this.setOfItem).sort((a, b) => {
          return a.index - b.index;
        }),
      })
      .subscribe((val) => {
        this.printing = false;
        if (val) {
          this.modalRef.close();
        }
      });
  }

  updateCheckedSet(item: itemExport, checked: boolean): void {
    if (checked) {
      this.setOfItem.add(item);
    } else {
      this.setOfItem.delete(item);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.itemsExports.every((item) => this.setOfItem.has(item));
    this.indeterminate =
      this.itemsExports.some((item) => this.setOfItem.has(item)) &&
      !this.checked;
  }

  onItemChecked(item: itemExport, checked: boolean): void {
    this.updateCheckedSet(item, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.itemsExports.forEach((item: itemExport) =>
      this.updateCheckedSet(item, checked)
    );
    this.refreshCheckedStatus();
  }
}
