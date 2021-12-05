import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DatetimeUnitEnum, FilterTypeEnum, Gender, SalaryTypeEnum, SearchTypeEnum } from '@minhdu-fontend/enums';
import { SearchTypeConstant } from '@minhdu-fontend/constants';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { debounceTime, startWith } from 'rxjs/operators';
import { Salary } from '@minhdu-fontend/data-models';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { SalaryService } from '../../service/salary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll, selectedLoadedPayroll, selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { Router } from '@angular/router';
import { SalaryBasicMultipleComponent } from '../dialog-salary/update-salary-basic-multiple/salary-basic-multiple.component';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { DialogBasicComponent } from '../dialog-salary/dialog-basic/dialog-basic.component';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  selector: 'app-payroll-basic',
  templateUrl: 'payroll-basic.component.html'
})
export class PayrollBasicComponent implements OnInit {
  pageType = PageTypeEnum;
  @Input() eventExportBasic?: Subject<boolean>;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  createdAt = getState(selectedCreateAtPayroll, this.store);
  formGroup = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    createdAt: new FormControl(this.datePipe.transform(
      new Date(this.createdAt), 'yyyy-MM'
    )),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getState(selectedPositionPayroll, this.store)),
    branch: new FormControl(getState(selectedBranchPayroll, this.store))
  });
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  totalSalaryBasic$ = this.store.select(selectedTotalPayroll);
  templateBasic$ = new Subject<any>();
  searchTypeConstant = SearchTypeConstant;
  loaded$ = this.store.select(selectedLoadedPayroll);
  genderType = Gender;
  unit = DatetimeUnitEnum;
  payrollBasic$ = this.store.pipe(select(selectorAllPayroll));
  salaryIds: number[] = [];
  isSelectSalary = false;
  salaries: Salary[] = [];
  pageSize = 30;
  pageIndex = 0;

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {
  }

  //dummy
  salaryBasic = [
    { title: 'Lương cơ bản trích BH', value: 'Lương cơ bản trích BH' },
    { title: 'Lương theo PL.HD', value: 'Lương theo PL.HD' },
    { title: 'Lương Tín nhiệm', value: 'Lương Tín nhiệm' },
    { title: 'Lương TN quản lý thêm', value: 'Lương TN quản lý thêm' },
    { title: 'Tất cả', value: '' }
  ];

  ngOnInit() {
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: {
        take: this.pageSize,
        skip: this.pageIndex,
        salaryType: SalaryTypeEnum.BASIC,
        filterType: FilterTypeEnum.SALARY,
        createdAt: new Date(this.createdAt),
        position: getState(selectedPositionPayroll, this.store),
        branch: getState(selectedBranchPayroll, this.store)
      }
    }));

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { createdAt: new Date(value.createdAt), branch: value.branch, position: value.position }));
        this.store.dispatch(PayrollAction.loadInit(
          {
            payrollDTO: this.mapPayrollBasic()
          }
        ));
      }
    );

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );

    this.payrollBasic$.subscribe(payrolls => {
      if (payrolls) {
        this.salaries = [];
        payrolls.forEach(payroll => {
          if (payroll.salaries) {
            payroll.salaries.forEach(salary => {
              if ((salary.type === SalaryTypeEnum.BASIC_INSURANCE || salary.type === SalaryTypeEnum.BASIC)) {
                if (this.isSelectSalary && !this.salaryIds.includes(salary.id)
                  && !this.salaries.find(e => e.id === salary.id)) {
                  this.salaryIds.push(salary.id);
                }
                this.salaries.push(salary);
              }
            });
          }
        });
      }
    });

    this.eventExportBasic?.subscribe(val => {
      if (val) {
        //export basic
      }
    });
  }

  readPayroll(event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', event.payrollId]).then();
  }

  addSalaryBasic() {
    const ref = this.dialog.open(DialogBasicComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.formGroup.get('createdAt')!.value,
        addMultiple: true,
        type: SalaryTypeEnum.BASIC
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title, { emitEvent: false });
        this.store.dispatch(PayrollAction.loadInit({
          payrollDTO: {
            take: this.pageIndex,
            skip: this.pageSize,
            code: this.formGroup.get('code')!.value,
            createdAt: this.formGroup.get('createdAt')!.value,
            salaryTitle: val.title,
            position: val.position,
            branch: val.branch
          }
        }));
      }
    });
  }

  updateMultipleSalaryBasic() {
    let salariesSelected: Salary[] = [];
    this.salaries.forEach(salary => {
      if (this.salaryIds.includes(salary.id)) {
        salariesSelected.push(salary);
      }
    });
    if (salariesSelected.every((value, index, array) => {
      return value.title === array[0].title;
    })) {
      const ref = this.dialog.open(DialogBasicComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: salariesSelected[0],
          salaryIds: this.salaryIds,
          updateMultiple: true
        }
      });
      ref.afterClosed().subscribe(
        val => {
          if (val) {
            this.isSelectSalary = false;
            this.salaryIds = [];
            const value = this.formGroup.value;
            this.formGroup.get('title')!.setValue(salariesSelected[0].title, { emitEvent: false });
            console.log(value);
            console.log(salariesSelected[0].title);
            const params = {
              take: this.pageSize,
              skip: this.pageIndex,
              code: this.formGroup.get('code')!.value,
              searchType: value.searchType,
              createdAt: value.createdAt,
              salaryTitle: salariesSelected[0].title,
              name: this.formGroup.get('name')!.value,
              salaryType: SalaryTypeEnum.BASIC,
              position: value.position,
              branch: value.branch
            };
            if (this.formGroup.get('name')!.value === '') {
              delete params.name;
            }
            console.log(params);
            this.store.dispatch(PayrollAction.loadInit(
              {
                payrollDTO: params
              }
            ));
          }
        }
      );
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteMultipleSalaryBasic() {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        let deleteSuccess = new Subject<number>();
        this.salaryIds.forEach((id, index) => {
          this.salaryService.delete(id).subscribe(
            (val: any) => {
              if (val) {
                deleteSuccess.next(index);
              }
            }
          );
        });
        deleteSuccess.subscribe(val => {
          console.log(val);
          if (val === this.salaryIds.length - 1) {
            this.isSelectSalary = false;
            this.salaryIds = [];
            this.snackbar.open('Xóa lương cơ bản thành công', '', { duration: 1500 });
            this.store.dispatch(PayrollAction.loadInit({ payrollDTO: this.mapPayrollBasic() }));
          }
        });
      }
    });
  }

  deleteSalaryBasic(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.snackbar.open(val.message, '', { duration: 1500 });
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(PayrollAction.loadInit(
              {
                payrollDTO: this.mapPayrollBasic()
              }
            ));
            this.snackbar.open('Xóa phiếu lương thành công', '', { duration: 1500 });
          }
        });
      }
    });
  }

  onScroll() {
    const value = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(
      {
        payrollDTO: this.mapPayrollBasic()
      }
    ));
  }

  mapPayrollBasic() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      searchType: value.searchType,
      createdAt: new Date(value.createdAt),
      salaryTitle: value.title ? value.title : '',
      name: value.name,
      filterType: FilterTypeEnum.SALARY,
      salaryType: SalaryTypeEnum.BASIC,
      position: value.position,
      branch: value.branch
    };
    if (!value.name) {
      delete params.name;
    }
    return params;
  }

  updateSelectSalary(id: number) {
    this.isSelectSalary = updateSelect(id, this.salaryIds, this.isSelectSalary, this.salaries);
  }

  someCompleteSalary(): boolean {
    return someComplete(this.salaries, this.salaryIds, this.isSelectSalary);
  }

  setAllSalary(select: boolean) {
    this.isSelectSalary = setAll(select, this.salaries, this.salaryIds);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }
}
