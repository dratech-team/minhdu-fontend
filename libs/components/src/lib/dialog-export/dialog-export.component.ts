import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterTypeEnum } from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { ItemExportService } from './item-export.service';

@Component({
  templateUrl: 'dialog-export.component.html'
})
export class DialogExportComponent implements OnInit {
  formGroup!: FormGroup;
  exportType = FilterTypeEnum;
  submitted = false;
  isSelectAll = true;
  itemsExport: any[] = [];
  itemSelected: any[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<DialogExportComponent>,
    private readonly itemExportService: ItemExportService,
    private readonly exportService: ExportService,
    private readonly datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group(this.data?.typeDate === 'RANGE_DATETIME' ? {
        name: new FormControl('', Validators.required),
        startedAt: this.data?.params?.startedAt ? new FormControl(
          this.datePipe.transform(
            new Date(this.data.params.startedAt),
            'YYYY-MM-dd'
          )
        ) : '',
        endedAt: this.data?.params?.endedAt ? new FormControl(
          this.datePipe.transform(
            new Date(this.data.params.endedAt),
            'YYYY-MM-dd'
          )
        ) : ''
      } : {
        name: new FormControl('', Validators.required),
        createdAt: new FormControl(
          this.datePipe.transform(
            new Date(this.data?.params?.createdAt),
            'YYYY-MM'
          )
        )
      }
    );

    this.itemExportService
      .getItemExport({exportType: this.data.params.exportType})
      .subscribe((val: any[]) => {
        val?.map((e, i) => {
          Object.assign(e, { index: i });
        });
        this.itemsExport = val;
        this.itemSelected = [...this.itemsExport];
      });
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    this.itemSelected.sort((a, b) => {
      return a.index - b.index;
    });
    console.log(this.data.params.exportType)
    if (this.data.params.exportType === FilterTypeEnum.OVERTIME || this.data.params.exportType === FilterTypeEnum.ABSENT) {
      Object.assign(this.data.params, {
        startedAt: new Date(value.startedAt),
        endedAt: new Date(value.endedAt)
      });
    } else {
      Object.assign(this.data.params, {
        createdAt: new Date(value.createdAt)
      });
    }
    this.exportService.print(
      this.data.api,
      this.data?.params
        ? Object.assign(this.data.params, { filename: value.name })
        : { filename: value.name },
      { items: this.itemSelected }
    );
    this.dialogRef.close();
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
