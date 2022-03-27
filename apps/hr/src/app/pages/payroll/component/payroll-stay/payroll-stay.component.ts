import {DatePipe} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, SearchTypeConstant} from '@minhdu-fontend/constants';
import {Branch, Position, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  FilterTypeEnum,
  Gender,
  ItemContextMenu,
  SalaryTypeEnum,
  SearchTypeEnum,
  sortEmployeeTypeEnum
} from '@minhdu-fontend/enums';
import {OrgchartActions} from '@minhdu-fontend/orgchart';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedPositionPayroll,
  selectedTotalPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {getAllPosition} from '@minhdu-fontend/orgchart-position';
import {checkInputNumber, getSelectors} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {TemplateSalaryAction} from '../../../template/+state/teamlate-salary/template-salary.action';
import {selectorAllTemplate} from '../../../template/+state/teamlate-salary/template-salary.selector';
import {SalaryService} from '../../service/salary.service';
import {setAll, someComplete, updateSelect} from '../../utils/pick-salary';
import {DialogStayComponent} from '../dialog-salary/dialog-stay/dialog-stay.component';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Payroll} from "../../+state/payroll/payroll.interface";

@Component({
  selector: 'app-payroll-stay',
  templateUrl: 'payroll-stay.component.html'
})
export class PayrollStayComponent implements OnInit, OnChanges {
  ItemContextMenu = ItemContextMenu;
  @Input() eventExportStay?: Subject<boolean>
  @Input() eventSearchBranch?: Branch;
  @Input() eventSelectIsLeave?: boolean;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  @ViewChild(MatSort) sort!: MatSort;

  createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);
  formGroup = new FormGroup({
    titles: new FormControl([]),
    code: new FormControl(''),
    name: new FormControl(''),
    isLeave: new FormControl(false),
    createdAt: new FormControl(
      this.datePipe.transform(new Date(this.createdAt), 'yyyy-MM')
    ),
    searchType: new FormControl(SearchTypeEnum.CONTAINS),
    position: new FormControl(getSelectors(selectedPositionPayroll, this.store)),
    branch: new FormControl(getSelectors(selectedBranchPayroll, this.store)),
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
  isEventSearch = false;
  sortEnum = sortEmployeeTypeEnum;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventSearchBranch?.currentValue !== changes.eventSearchBranch?.previousValue) {
      this.formGroup.get('branch')?.patchValue(changes.eventSearchBranch.currentValue)
    }
    if (changes.eventSelectIsLeave?.currentValue !== changes.eventSelectIsLeave?.previousValue) {
      this.formGroup.get('isLeave')?.setValue(changes.eventSelectIsLeave.currentValue)
    }
  }

  ngOnInit() {
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          take: this.pageSize,
          skip: this.pageIndex,
          createdAt: new Date(this.createdAt),
          filterType: FilterTypeEnum.STAY,
          position: getSelectors<Position>(selectedPositionPayroll, this.store)?.name || '',
          branch: getSelectors<Branch>(selectedBranchPayroll, this.store)?.name || '',
          isLeave: false
        }
      })
    );

    this.store.dispatch(OrgchartActions.init());

    this.store.dispatch(
      TemplateSalaryAction.loadALlTemplate({salaryType: SalaryTypeEnum.STAY})
    );
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      this.store.dispatch(
        PayrollAction.updateStatePayroll({
          createdAt: new Date(value.createdAt),
          position: value.position
        })
      );
      this.store.dispatch(
        PayrollAction.loadInit({
          payrollDTO: this.mapPayrollStay()
        })
      );
    });

    this.payrollStay$.subscribe((payrolls) => {
      if (payrolls) {
        if (payrolls.length === 0) {
          this.isSelectSalary = false;
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
                  this.salariesSelected.push({salary, payroll: payroll});
                }
                this.salaries.push({salary, payroll: payroll});
              }
            });
          }
        });
      }
    });

    this.eventExportStay?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollStay = {
          code: value.code || '',
          name: value.name,
          position: value.position?.name || '',
          branch: value.branch.name || '',
          exportType: FilterTypeEnum.STAY,
          titles: value.titles,
          isLeave: value.isLeave
        };
        if (value.createdAt) {
          Object.assign(payrollStay, {createdAt: value.createdAt});
        }
        const ref = this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuât bảng phụ cấp lương',
            params: payrollStay,
            isPayroll: true,
            api: Api.HR.PAYROLL.EXPORT
          }
        });
      }
    });
  }

  readPayroll(event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', event.id])
      .then();
  }

  addSalaryStay() {
    const ref = this.dialog.open(DialogStayComponent, {
      width: 'fit-content',
      data: {
        addMultiple: true,
        createdAt: this.formGroup.get('createdAt')?.value,
        type: SalaryTypeEnum.STAY
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup.get('titles')?.setValue([val.title], {emitEvent: false});
        const value = this.formGroup.value;
        this.store.dispatch(
          PayrollAction.loadInit({
            payrollDTO: {
              take: this.pageSize,
              skip: this.pageIndex,
              code: value.code,
              createdAt: value.createdAt,
              titles: val.title,
              filterType: FilterTypeEnum.STAY,
              position: val.position?.name || '',
              branch: value.branch.name || '',
              isLeave: value.isLeave
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
          this.formGroup.get('titles')?.setValue([val.title], {emitEvent: false});
          console.log(this.formGroup.value.titles)
          this.store.dispatch(
            PayrollAction.loadInit({
              payrollDTO: {
                take: this.pageSize,
                skip: this.pageIndex,
                code: value.code,
                searchType: value.searchType,
                createdAt: new Date(value.createdAt),
                titles: [val.title],
                name: value.name,
                filterType: FilterTypeEnum.STAY,
                position: val.position,
                branch: value.branch.name || '',
                isLeave: value.isLeave
              }
            })
          );
        }
      });
    } else {
      this.message.error('chưa chọn cùng loại lương');
    }
  }

  deleteMultipleSalaryStay() {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        const deleteSuccess = new Subject<number>();
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
            this.message.success('Xóa phụ cấp lương thành công');
            this.store.dispatch(
              PayrollAction.loadInit({payrollDTO: this.mapPayrollStay()})
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
            this.message.success('Xóa phiếu lương thành công');
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
    this.isEventSearch = false;
    const value = this.formGroup.value;
    this.store.dispatch(
      PayrollAction.loadMorePayrolls({
        payrollDTO: this.mapPayrollStay()
      })
    );
  }

  updateSelectSalary(salary: Salary, payroll: Payroll) {
    const salarySelected = {salary, payroll};
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
      titles: value.titles,
      name: value.name,
      filterType: FilterTypeEnum.STAY,
      position: value.position?.name || '',
      branch: value.branch.name || '',
      isLeave: value.isLeave
    };
    if (this.sort?.active) {
      Object.assign(params, {
        orderBy: this.sort.active,
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    if (!value.name) {
      delete params.name;
    }
    return params;
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  selectSalary(salary: Salary) {
    return this.salariesSelected.some((e) => e.salary.id === salary.id);
  }

  sortPayroll() {
    this.store.dispatch(PayrollAction.loadInit({
      payrollDTO: this.mapPayrollStay()
    }));
  }
}
