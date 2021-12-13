import { DatePipe } from '@angular/common';
import {
  AfterContentChecked, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Api, SearchTypeConstant } from '@minhdu-fontend/constants';
import { Employee, Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  SalaryTypeEnum,
  SearchTypeEnum
} from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { checkInputNumber } from '../../../../../../../../libs/utils/checkInputNumber.util';
import { getSelectors } from '../../../../../../../../libs/utils/getState.ultils';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { AppState } from '../../../../reducers';
import { SalaryService } from '../../service/salary.service';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogBasicComponent } from '../dialog-salary/dialog-basic/dialog-basic.component';
import { DialogExportComponent } from '../../../../../../../../libs/components/src/lib/dialog-export/dialog-export.component';

@Component({
  selector: 'app-payroll-basic',
  templateUrl: 'payroll-basic.component.html'
})
export class PayrollBasicComponent implements OnInit {
  pageType = PageTypeEnum;
  @Input() eventExportBasic?: Subject<boolean>;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  formGroup = new FormGroup({
    title: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),
    createdAt: new FormControl(
      this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM')
    ),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getSelectors(selectedPositionPayroll, this.store)),
    branch: new FormControl(getSelectors(selectedBranchPayroll, this.store))
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
  salariesSelected: SalaryPayroll[] = [];
  isSelectSalary = false;
  pageSize = 30;
  pageIndex = 0;
  salaries: SalaryPayroll[] = [];
  isEventSearch = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private ref: ChangeDetectorRef
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
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          salaryType: SalaryTypeEnum.BASIC,
          filterType: FilterTypeEnum.SALARY,
          createdAt: new Date(this.createdAt),
          position: getSelectors(selectedPositionPayroll, this.store),
          branch: getSelectors(selectedBranchPayroll, this.store)
        }
      })
    );

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.createdAt),
          branch: value.branch,
          position: value.position
        })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollBasic()
        })
      );
    });

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );

    this.payrollBasic$.subscribe((payrolls) => {
      console.log(Number(getSelectors(selectedTotalPayroll, this.store)))
      if (payrolls) {
        this.salaries = [];
        if(payrolls.length === 0){
          this.isSelectSalary = false
        }
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (
                salary.type === SalaryTypeEnum.BASIC_INSURANCE ||
                salary.type === SalaryTypeEnum.BASIC
              ) {
                if (this.isEventSearch) {
                  this.isSelectSalary =
                    this.salariesSelected.length > 0
                    && this.salariesSelected.length >= Number(getSelectors(selectedTotalPayroll, this.store))
                    && this.salaries.every(item => this.salariesSelected.some(val => val.salary.id === item.salary.id));
                }
                if (
                  this.isSelectSalary &&
                  !this.salariesSelected.some(item => item.salary.id === salary.id)
                  && !this.salaries.find((e) => e.salary.id === salary.id)
                ) {
                  this.salariesSelected.push({ salary, employee: payroll.employee });
                }
                this.salaries.push({ salary, employee: payroll.employee });
              }
            });
          }
        });
      }
    });

    this.eventExportBasic?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollBASIC = {
          code: value.code || '',
          name: value.name,
          position: value.position,
          branch: value.branch,
          exportType: FilterTypeEnum.STAY,
          title: value.title
        };
        if(value.createdAt){
          Object.assign(payrollBASIC, {createdAt: value.createdAt})
        }
        const ref = this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuât bảng lương cơ bản',
            exportType: FilterTypeEnum.BASIC,
            params: payrollBASIC,
            api: Api.HR.PAYROLL.PAYROLL
          }
        });
      }
    });
  }

  readPayroll(event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', event.payrollId])
      .then();
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
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title, { emitEvent: false });
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: {
              take: this.pageIndex,
              skip: this.pageSize,
              code: this.formGroup.get('code')!.value,
              createdAt: this.formGroup.get('createdAt')!.value,
              salaryTitle: val.title,
              position: val.position,
              branch: val.branch
            }
          })
        );
      }
    });
  }

  updateMultipleSalaryBasic() {
    const value = this.formGroup.value;
    if (
      this.salariesSelected.every((value, index, array) => {
        return value.salary.title === array[0].salary.title;
      })
    ) {
      const ref = this.dialog.open(DialogBasicComponent, {
        width: 'fit-content',
        data: {
          updateMultiple: true,
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected
        }
      });
      ref.componentInstance.EmitSalariesSelected.subscribe((val) => {
        this.salariesSelected = val;
        this.isSelectSalary = this.salaries.length > 0
          && this.salaries.every(e => this.salariesSelected.some(item => item.salary.id === e.salary.id));
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
          if (val.salariesSelected) {
            this.salariesSelected = val.salariesSelected;
            this.isSelectSalary = this.salariesSelected.length > 0 &&
              this.salaries.every(e => this.salariesSelected.some(item => item.salary.id === e.salary.id));
          }
          this.isSelectSalary = false;
          this.salariesSelected = [];
          this.formGroup
            .get('title')!
            .setValue(val.title, { emitEvent: false });
          const params = {
            take: this.pageSize,
            skip: this.pageIndex,
            code: this.formGroup.get('code')!.value,
            searchType: value.searchType,
            createdAt: value.createdAt,
            salaryTitle: val.title,
            name: this.formGroup.get('name')!.value,
            salaryType: SalaryTypeEnum.BASIC,
            filterType: FilterTypeEnum.SALARY,
            position: value.position,
            branch: value.branch
          };
          if (this.formGroup.get('name')!.value === '') {
            delete params.name;
          }
          console.log(params);
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: params
            })
          );
        }
      });
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteMultipleSalaryBasic() {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        let deleteSuccess = new Subject<number>();
        this.salariesSelected.forEach((item, index) => {
          this.salaryService.delete(item.salary.id).subscribe((val: any) => {
            if (val) {
              deleteSuccess.next(index);
            }
          });
        });
        deleteSuccess.subscribe((val) => {
          if (val === this.salariesSelected.length - 1) {
            this.isSelectSalary = false;
            this.salariesSelected = [];
            this.snackbar.open('Xóa lương cơ bản thành công', '', {
              duration: 1500
            });
            this.store.dispatch(
              PayrollAction.loadInit({ payrollDTO: this.mapPayrollBasic() })
            );
          }
        });
      }
    });
  }

  deleteSalaryBasic(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.snackbar.open(val.message, '', { duration: 1500 });
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.store.dispatch(
              PayrollAction.loadInit({
                payrollDTO: this.mapPayrollBasic()
              })
            );
            this.snackbar.open('Xóa phiếu lương thành công', '', {
              duration: 1500
            });
          }
        });
      }
    });
  }

  onScroll() {
    this.isEventSearch = true;
    const value = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollBasic()
      })
    );
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

  updateSelectSalary(salarySelected: SalaryPayroll) {
    this.isSelectSalary = updateSelect(
      salarySelected,
      this.salariesSelected,
      this.isSelectSalary,
      this.salaries
    );
  }

  someCompleteSalary(): boolean {
    return someComplete(this.salaries, this.salariesSelected, this.isSelectSalary);
  }

  setAllSalary(select: boolean) {
    this.isSelectSalary = setAll(select, this.salaries, this.salariesSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  selectSalary(salary: Salary) {
    return this.salariesSelected.some((e) => e.salary.id === salary.id);
  }
}
