import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterTypeEnum} from '@minhdu-fontend/enums';
import {ExportService} from '@minhdu-fontend/service';
import {ItemExportService} from './item-export.service';
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ModalExportExcelData} from "../data/modal-export-excel.data";

@Component({
  templateUrl: 'modal-export-excel.component.html'
})
export class ModalExportExcelComponent implements OnInit {
  @Input() data!: ModalExportExcelData
  formGroup!: FormGroup;
  exportType = FilterTypeEnum;
  isSelectAll = true;
  itemsExport: any[] = [];
  itemSelected: any[] = [];
  loading = true
  printing = false;

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly itemExportService: ItemExportService,
    private readonly exportService: ExportService,
    private readonly datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group(this.data?.typeDate === 'RANGE_DATETIME' ? {
        name: [this.data.filename || '', Validators.required],
        rangeDay: [
          [
            new Date(this.data.params?.startedAt || this.data.params?.startedAt_start),
            new Date(this.data.params?.endedAt || this.data.params?.startedAt_end)
          ]
        ]
      } : {
        name: new FormControl(this.data?.filename ? this.data.filename : '', Validators.required),
        createdAt: [this.data.selectDatetime ? this.datePipe.transform(
          new Date(this.data.params?.startedAt || this.data.params?.startedAt_start),
          'YYYY-MM') : '']
      }
    );

    this.itemExportService
      .getItemExport({exportType: this.data.params.exportType})
      .subscribe((val: any[]) => {
        this.loading = false
        val?.map((e, i) => {
          Object.assign(e, {index: i});
        });
        this.itemsExport = val;
        this.itemSelected = [...this.itemsExport];
      });
  }

  onSubmit(): any {
    this.printing = true
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    this.itemSelected.sort((a, b) => {
      return a.index - b.index;
    });

    if (this.data?.selectDatetime) {
      if (this.data.typeDate === 'RANGE_DATETIME') {
        Object.assign(this.data.params, {
          startedAt: new Date(value.rangeDay[0]),
          endedAt: new Date(value.rangeDay[1]),
        });
      } else {
        Object.assign(this.data.params, {
          startedAt: getFirstDayInMonth(new Date(value.createdAt)),
          endedAt: getLastDayInMonth(new Date(value.createdAt))
        });
      }
    }

    Object.assign(this.data.params, {filename: value.name})

    this.exportService.print(
      this.data.api,
      this.data.params,
      {items: this.itemSelected}
    ).subscribe(val => {
      this.printing = false
      if (val) {
        this.modalRef.close()
      }
    })
  }

  someComplete(): boolean {
    return (
      this.itemsExport.filter((val: any) =>
        this.itemSelected.some((item: any) => item.key === val.key)
      ).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.itemsExport == null) {
      return;
    }
    this.itemsExport?.forEach((item: any) => {
      if (select) {
        if (!this.itemSelected.some((val: any) => val.key === item.key)) {
          this.itemSelected.push(item);
        }
      } else {
        const index = this.itemSelected.findIndex(
          (val: any) => val.key === item.key
        );
        if (index > -1) {
          this.itemSelected.splice(index, 1);
        }
      }
    });
  }

  updateSelect(item: any) {
    const index = this.itemSelected.findIndex(
      (val: any) => val.key === item.key
    );
    if (index > -1) {
      this.itemSelected.splice(index, 1);
    } else {
      this.itemSelected.push(item);
    }
    this.isSelectAll =
      this.itemsExport !== null &&
      this.itemsExport.every((item: any) =>
        this.itemSelected.some((val: any) => val.key === item.key)
      );
  }

  selectItem(val: any) {
    return this.itemSelected.some((item: any) => item.key === val.key);
  }
}
