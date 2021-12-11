import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SearchTypeConstant } from '@minhdu-fontend/constants';
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
import { TemplateSalaryAction } from '../../../template/+state/teamlate-salary/template-salary.action';
import { selectorAllTemplate } from '../../../template/+state/teamlate-salary/template-salary.selector';
import { SalaryService } from '../../service/salary.service';
import { setAll, someComplete, updateSelect } from '../../utils/pick-salary';
import { DialogStayComponent } from '../dialog-salary/dialog-stay/dialog-stay.component';

@Component({
  selector: 'app-payroll-stay',
  templateUrl: 'payroll-stay.component.html'
})
export class PayrollStayComponent implements OnInit {
  pageType = PageTypeEnum;
  @Input() eventExportStay?: Subject<boolean>;
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
  totalSalaryStay$ = this.store.select(selectedTotalPayroll);
  searchTypeConstant = SearchTypeConstant;
  loaded$ = this.store.select(selectedLoadedPayroll);
  genderType = Gender;
  unit = DatetimeUnitEnum;
  payrollStay$ = this.store.pipe(select(selectorAllPayroll));
  salariesStay$ = this.store.pipe(select(selectorAllTemplate));
  salariesSelected: SalaryPayroll[] = [];
  isSelectSalary = false;
  salaries: SalaryPayroll[] = [];
  pageSize = 30;
  pageIndex = 0;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
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

  ngOnInit() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          createdAt: new Date(this.createdAt),
          salaryType: SalaryTypeEnum.STAY,
          filterType: FilterTypeEnum.SALARY,
          position: getSelectors(selectedPositionPayroll, this.store),
          branch: getSelectors(selectedBranchPayroll, this.store)
        }
      })
    );

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.store.dispatch(
      TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.STAY })
    );
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.createdAt),
          branch: value.branch,
          position: value.position
        })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollStay()
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

    this.payrollStay$.subscribe((payrolls) => {
      if (payrolls) {
        if(payrolls.length === 0){
          this.isSelectSalary = false
        }
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.STAY) {
                if (this.isEventSearch) {
                  this.isSelectSalary =
                    this.salariesSelected.length > 0
                    && this.salariesSelected.length >= Number(getSelectors(selectedTotalPayroll, this.store))
                    && this.salaries.every(item => this.salariesSelected.some(val => val.salary.id === item.salary.id));
                }
                if (
                  this.isSelectSalary &&
                  !this.salariesSelected.some(item => item.salary.id === salary.id) &&
                  !this.salaries.find((e) => e.salary.id === salary.id)
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
  }

  readPayroll(event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', event.payrollId])
      .then();
  }

  addSalaryStay() {
    const ref = this.dialog.open(DialogStayComponent, {
      width: 'fit-content',
      data: {
        addMultiple: true,
        createdAt: this.formGroup.get('createdAt')!.value,
        type: SalaryTypeEnum.STAY
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('title')!.setValue(val.title, { emitEvent: false });
        const value = this.formGroup.value;
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: {
              take: this.pageSize,
              skip: this.pageIndex,
              code: value.code,
              createdAt: this.formGroup.get('createdAt')!.value,
              salaryTitle: val.title,
              salaryType: SalaryTypeEnum.STAY,
              filterType: FilterTypeEnum.SALARY,
              position: val.position,
              branch: val.branch
            }
          })
        );
      }
    });
  }

  updateMultipleSalaryStay() {
    if (
      this.salariesSelected.every((value, index, array) => {
        return value.salary.title === array[0].salary.title;
      })
    ) {
      const ref = this.dialog.open(DialogStayComponent, {
        width: 'fit-content',
        data: {
          isUpdate: true,
          salary: this.salariesSelected[0].salary,
          salariesSelected: this.salariesSelected,
          updateMultiple: true
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
          this.isSelectSalary = false;
          this.salariesSelected = [];
          const value = this.formGroup.value;
          this.formGroup
            .get('title')!
            .setValue(val.title, { emitEvent: false });
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: {
                take: this.pageSize,
                skip: this.pageIndex,
                code: value.code,
                searchType: value.searchType,
                createdAt: new Date(value.createdAt),
                salaryTitle: val.title,
                name: value.name,
                salaryType: SalaryTypeEnum.STAY,
                filterType: FilterTypeEnum.SALARY,
                position: val.position,
                branch: val.branch
              }
            })
          );
        }
      });
    } else {
      this.snackbar.open('chưa chọn cùng loại  lương', 'Đóng');
    }
  }

  deleteMultipleSalaryStay() {
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
            this.snackbar.open('Xóa phụ cấp lương thành công', '', {
              duration: 1500
            });
            this.store.dispatch(
              PayrollAction.loadInit({ payrollDTO: this.mapPayrollStay() })
            );
          }
        });
      }
    });
  }

  deleteSalaryStay(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.snackbar.open('Xóa phiếu lương thành công', '', {
              duration: 1500
            });
            this.store.dispatch(
              PayrollAction.loadInit({
                payrollDTO: this.mapPayrollStay()
              })
            );
          }
        });
      }
    });
  }

  onScroll() {
    this.isEventSearch = false
    const value = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollStay()
      })
    );
  }

  updateSelectSalary(salary: Salary, employee: Employee) {
    const salarySelected = { salary, employee };
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

  mapPayrollStay() {
    const value = this.formGroup.value;
    const params = {
      take: this.pageSize,
      skip: this.pageIndex,
      code: value.code,
      searchType: value.searchType,
      createdAt: new Date(value.createdAt),
      salaryTitle: value.title ? value.title : '',
      name: value.name,
      salaryType: SalaryTypeEnum.STAY,
      filterType: FilterTypeEnum.SALARY,
      position: value.position,
      branch: value.branch
    };
    if (!value.name) {
      delete params.name;
    }
    return params;
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
