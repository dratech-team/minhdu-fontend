import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Router } from '@angular/router';
import { selectorAllPayroll } from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { AddPayrollComponent } from '../../component/add-payroll/add-payroll.component';
import { SalaryComponent } from '../../component/salary/salary.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';

@Component({
  templateUrl: 'payroll.component.html'
})


export class PayrollComponent implements OnInit {
  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
      branch: new FormControl(''),
      paidAt: new FormControl(''),
      accConfirmedAt: new FormControl(''),
      createdAt: new FormControl()
    }
  );
  salaryType = SalaryTypeEnum;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageIndex: number = 1;
  pageSize: number = 30;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  code?: string;

  constructor(
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  dataPayroll = [
    {
      stt: 1,
      name: 'ádasd',
      actualDay: 30,
      workday: 26,
      position: 'ádas',
      basic: 3000000,
      allowances: 3000000,
      stayedAt: 3000000,
      deductions: 3000000,
      total: 3000000,
      tax: 3000000,
      assign: '',
      note: 'asasasasasdasasas'
    },
    {
      stt: 1,
      name: 'ádasd',
      actualDay: 30,
      workday: 26,
      position: 'ádas',
      basic: 3000000,
      allowances: 3000000,
      stayedAt: 3000000,
      deductions: 3000000,
      total: 3000000,
      tax: 3000000,
      assign: '',
      note: 'asasasasasdasasas'
    },
    {
      stt: 1,
      name: 'ádasd',
      actualDay: 30,
      workday: 26,
      position: 'ádas',
      basic: 3000000,
      allowances: 3000000,
      stayedAt: 3000000,
      deductions: 3000000,
      total: 3000000,
      tax: 3000000,
      assign: '',
      note: 'asasasasasdasasas'
    },
    {
      stt: 1,
      name: 'ádasd',
      actualDay: 30,
      workday: 26,
      position: 'ádas',
      basic: 3000000,
      allowances: 3000000,
      stayedAt: 3000000,
      deductions: 3000000,
      total: 3000000,
      tax: 3000000,
      assign: '',
      note: 'asasasasasdasasas'
    }
  ];
  dataTimekeeping = {
    createAt: new Date(2021, 2),
    data: [
      {
        employeeID: 1,
        name: 'ádasd',
        dayOff: [new Date('7/7/2021'), new Date('7/5/2021'), new Date('1/3/2021')]
      },
      {
        employeeID: 1,
        name: 'ádasd',
        dayOff: [new Date('7/7/2021'), new Date('7/5/2021'), new Date('1/3/2021')]
      },
      {
        employeeID: 1,
        name: 'ádasd',
        dayOff: [new Date('7/7/2021'), new Date('7/5/2021'), new Date('1/3/2021')]
      }

    ]
  };


  ngOnInit() {
    this.store.dispatch(PayrollAction.loadInit({ skip: 0, take: 30 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(PayrollAction.loadInit(this.Payroll(val, 30, 0)));
      })
    ).subscribe();
  }

  Payroll(val: any, pageSize: number, pageIndex: number) {
    if (val.createdAt) {
      return {
        skip: pageSize * pageIndex++,
        take: this.pageSize,
        code: val.code,
        name: val.name,
        position: val.position,
        department: val.department,
        branch: val.branch,
        createdAt: val.createdAt.toString(),
        paidAt: val.paidAt,
        accConfirmedAt: val.accConfirmedAt
      };
    } else {
      return {
        skip: pageSize * pageIndex++,
        take: this.pageSize,
        code: val.code,
        name: val.name,
        position: val.position,
        department: val.department,
        branch: val.branch,
        paidAt: val.paidAt,
        accConfirmedAt: val.accConfirmedAt
      };
    }
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(this.Payroll(val, this.pageSize, this.pageIndex)));
  }

  addPayroll($event?: any): void {
    const dialogRef = this.dialog.open(AddPayrollComponent, {
      width: '50%',
      data: { id: $event?.employee?.id }
    });
    dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.store.dispatch(PayrollAction.addPayroll({ payroll: value }));
        }
      }
    );
  }

  updatePayroll(id: number, type: string) {
      this.dialog.open(UpdateConfirmComponent, {
        width: '25%',
        data:{id, type}
      })
  }

  addSalary(type: SalaryTypeEnum): any {
    const dialogRef = this.dialog.open(SalaryComponent, {
      width: '50%',
      data: { type: type }
    });
    dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.store.dispatch(PayrollAction.addSalary({
            salary: value.data
          }));
        }
      }
    );
  }

  readPayroll($event: any) {
    this.router.navigate(['payroll/detail-payroll', $event.id]).then();
  }

  exportPayroll() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Bảng lương');
    worksheet.getRow(1).font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.mergeCells('A1', 'M1');
    worksheet.mergeCells('A2', 'M3');
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').value = 'Bảng lương nhân viên';
    worksheet.getCell('A2').font = {
      size: 18,
      bold: true
    };
    worksheet.mergeCells('A4', 'M4');
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A4').value = '11/2010';
    worksheet.getCell('A4').font = {
      size: 16,
      bold: true
    };
    worksheet.columns = [
      { header: '', key: 'stt', width: 5, alignment: { vertical: 'middle', horizontal: 'center' } },
      { header: '', key: 'name', width: 25, alignment: { vertical: 'middle', horizontal: 'center' } },
      { header: '', key: 'workday', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
      { header: '', key: 'realityDay', width: 20 },
      { header: '', key: 'position', width: 25 },
      { header: '', key: 'basic', width: 15, style: { numFmt: '#,###,###,###' } },
      { header: '', key: 'stayAt', width: 15, style: { numFmt: '#,###,###,###' } },
      { header: '', key: 'allowance', width: 15, style: { numFmt: '#,###,###,###' } },
      { header: '', key: 'deduct', width: 15, style: { numFmt: '#,###,###,###' } },
      { header: '', key: 'total', width: 15, style: { numFmt: '#,###,###,###' } },
      { header: '', key: 'tax', width: 15, style: { numFmt: '#,###,###,###' } },
      { header: '', key: 'sign', width: 10 },
      { header: '', key: 'note', width: 30 }
    ];
    worksheet.getRow(5).values = [
      'stt',
      'Tên nhân viên',
      'Ngày công thực tế',
      'NGày công chuẩn',
      'Chức vụ',
      'Lương cơ bản',
      'Phụ cấp ở lại',
      'Phụ cấp',
      'Khấu trừ',
      'Tổng cộng',
      'Thuế',
      'Kí tên',
      'CHú thích'
    ];
    worksheet.getRow(5).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(5).font = {
      size: 13,
      bold: true
    };
    worksheet.properties.defaultRowHeight = 20;
    for (const x1 of this.dataPayroll) {
      const x2 = Object.values(x1);
      const temp = [];
      for (const y of x2) {
        temp.push(y);
      }
      worksheet.addRow(temp).alignment = { vertical: 'middle', horizontal: 'center' };
    }
    const name = new Date().toString();
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name);
    });
  }

  exportTimekeeping(data: any) {

    const monthCurrent = this.dataTimekeeping.createAt.getMonth();
    const yearCurrent = this.dataTimekeeping.createAt.getFullYear();
    const DaysInMonth = new Array(new Date(yearCurrent, monthCurrent, 0).getDate()).fill('').map((value, index) =>
      this.datePipe.transform(new Date(yearCurrent, monthCurrent - 1, index + 1), 'dd/MM/yyyy'));
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Bảng chấm công');
    worksheet.getRow(1).font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.mergeCells('A1', 'M1');
    worksheet.mergeCells('A2', 'M3');
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').value = 'Bảng Chấm công nhân viên';
    worksheet.getCell('A2').font = {
      size: 18,
      bold: true
    };
    worksheet.mergeCells('A4', 'M4');
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A4').value = monthCurrent + '/' + yearCurrent;
    worksheet.getCell('A4').font = {
      size: 16,
      bold: true
    };
    worksheet.columns =
      [
        { header: '', width: 5, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 30, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: '', width: 20, alignment: { vertical: 'middle', horizontal: 'center' } }
      ];

    worksheet.getRow(5).values = ['stt', 'Mã nhân viên', 'Tên nhân viên', ...DaysInMonth];
    worksheet.getRow(5).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(5).font = {
      size: 13,
      bold: true
    };
    worksheet.properties.defaultRowHeight = 20;
    for (let i = 0; i < this.dataTimekeeping.data.length; i++) {
      let dataResult: any[] = [];
      const value: any[] = [];
      const temp: any[] = [];
      value.push(i + 1);
      const x2 = Object.values(this.dataTimekeeping.data[i]);
      x2.map(val => {
        if (!Array.isArray(val)) {
          value.push(val);
        } else {
          const Timekeeping = Array(31).fill('+');
          val.map(e => {
            Timekeeping[e.getDate() - 1] = '-';
          });
          dataResult = value.concat(Timekeeping);
        }
        for (const y of dataResult) {
          temp.push(y);
        }
      });
      worksheet.addRow(temp).alignment = { vertical: 'middle', horizontal: 'center' };
    }


    const name = monthCurrent + '/' + yearCurrent;
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name);
    });
  }
}
