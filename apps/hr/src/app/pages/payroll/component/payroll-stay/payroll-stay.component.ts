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
import {
  checkInputNumber,
  filterSalaryPayroll,
  getFirstDayInMonth,
  getLastDayInMonth,
  getSelectors, updateSelectOneSalaryPayroll
} from '@minhdu-fontend/utils';
import {AppState} from '../../../../reducers';
import {SalaryService} from '../../service/salary.service';
import {setAll, someComplete, updateSelect} from '../../utils/pick-salary';
import {DialogStayComponent} from '../dialog-salary/dialog-stay/dialog-stay.component';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {MatSort} from '@angular/material/sort';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Payroll} from "../../+state/payroll/payroll.interface";
import {PayrollService} from "../../service/payroll.service";
import {ExportService} from "@minhdu-fontend/service";
import {ClassifyOvertimeComponent} from "../classify-overtime/classify-overtime.component";

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
  salariesSelected: SalaryPayroll[] = [];
  salaries: SalaryPayroll[] = [];
  pageSize = 30;
  pageIndex = 0;
  positions$ = this.store.pipe(select(getAllPosition));
  isEventSearch = false;
  sortEnum = sortEmployeeTypeEnum;
  templateStays: string [] = []
  loadingDelete = false
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private ref: ChangeDetectorRef,
    private payrollService: PayrollService,
    private exportService: ExportService,
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

    this.getTemplateStay(
      this.createdAt,
      getSelectors<Branch>(selectedBranchPayroll, this.store)?.name,
      getSelectors<Position>(selectedPositionPayroll, this.store)?.name,
    )

    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe((value) => {
      this.isEventSearch = true;
      if (value.createdAt) {
        this.getTemplateStay(value.createdAt, value.branch?.name, value.position?.name,)
      }
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
        this.salaries = [];
        payrolls.forEach((payroll) => {
          if (payroll.salaries) {
            payroll.salaries.forEach((salary) => {
              if (salary.type === SalaryTypeEnum.STAY) {
                this.salaries.push({salary, payroll: payroll});
                if (filterSalaryPayroll(this.salariesSelected, salary).length > 0 &&
                  this.salariesSelected.every(salaryPayroll => salaryPayroll.salary.id !== salary.id)
                ) {
                  this.salariesSelected.push({salary, payroll})
                }
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
            filename: `Xuất bản phụ cấp lương tháng ${this.datePipe.transform(value.createdAt, 'MM-yyyy')}`,
            title: 'Xuât bảng phụ cấp lương',
            params: payrollStay,
            isPayroll: true,
          }
        }).afterClosed().subscribe(val => {
          if (val) {
            this.exportService.print(
              Api.HR.PAYROLL.EXPORT,
              val.params,
              {items: val.itemSelected}
            );
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
        this.ref.detectChanges();
      });
      ref.afterClosed().subscribe((val) => {
        if (val) {
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
        this.loadingDelete = true
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
            this.loadingDelete = false
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

  updateSelectSalary(salaryPayroll:SalaryPayroll ,event: boolean) {
    this.dialog.open(ClassifyOvertimeComponent, {
      data: {
        title: 'Chọn loại phụ cấp',
        type: event ? "SELECT" : "REMOVE",
        salary: salaryPayroll.salary
      }
    }).afterClosed().subscribe(type => {
      if (type === 'ALL') {
        if (event) {
          this.salariesSelected = [...
            filterSalaryPayroll(this.salaries, salaryPayroll.salary)
          ]
        } else {
          filterSalaryPayroll(this.salaries, salaryPayroll.salary).forEach(val => {
            const index = this.salariesSelected.findIndex(value => value.salary.id === val.salary.id)
            this.salariesSelected.splice(index, 1)
          })
        }

      } else {
        updateSelectOneSalaryPayroll(event, salaryPayroll, this.salariesSelected)
      }
    })
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

  getTemplateStay(createdAt: Date, branch?: string, position?: string) {
    this.payrollService.getAllTempLate({
      branch: branch || '',
      position: position || '',
      startedAt: this.datePipe.transform(getFirstDayInMonth(new Date(createdAt)), 'yyyy-MM-dd'),
      endedAt: this.datePipe.transform(getLastDayInMonth(new Date(createdAt)), 'yyyy-MM-dd'),
      salaryType: SalaryTypeEnum.STAY
    }).subscribe(val => this.templateStays = val)
  }
}
