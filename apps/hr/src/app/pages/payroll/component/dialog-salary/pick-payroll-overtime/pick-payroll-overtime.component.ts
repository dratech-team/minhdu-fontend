import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {debounceTime, startWith, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {getAllPosition, PositionActions} from "@minhdu-fontend/orgchart-position";
import {checkIsSelectAllInit, pickAll, pickOne, searchAutocomplete} from "@minhdu-fontend/utils";
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {PayrollService} from "../../../service/payroll.service";
import {NzMessageService} from "ng-zorro-antd/message";


@Component({
  selector: 'app-pick-payroll-overtime',
  templateUrl: 'pick-payroll-overtime.component.html'
})
export class PickPayrollOvertimeComponent implements OnInit, OnChanges {
  @Input() checkAllowance = false;
  @Input() search: any;
  @Input() payrollsSelected: Payroll[] = [];
  @Input() allowPayrollsSelected: Payroll[] = [];
  @Output() EventSelectPayroll = new EventEmitter<Payroll[]>();
  @Output() EventSelectAllowance = new EventEmitter<Payroll[]>();
  formGroup = new FormGroup({
    name: new FormControl(''),
    position: new FormControl(''),
    code: new FormControl('')
  });
  pageSize = 20;
  pageIndex = 0;
  pageSizeTable = 5
  loading = false
  totalPayroll = 0
  type = SalaryTypeEnum;

  isSelectAllPayroll = false;
  isSelectAllowance = false;
  payrolls: Payroll[] = [];
  positions$ = this.store.pipe(select(getAllPosition));
  differ: any;
  loadMore = false;

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly message: NzMessageService,
    private readonly payrollService: PayrollService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payrollsSelected) {
      if (changes.payrollsSelected.currentValue.length === 0) {
        this.isSelectAllPayroll = false;
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllPayroll =
          this.payrolls !== null &&
          this.payrolls.every((e) => this.payrollsSelected.some(item => item.id === e.id));
      }
    }
    if (changes.allowPayrollsSelected) {
      if (changes.allowPayrollsSelected.currentValue.length === 0) {
        this.isSelectAllowance = false;
      } else {
        this.isSelectAllowance =
          this.payrolls !== null &&
          this.payrolls.every((e) => this.allowPayrollsSelected.some(item => item.id === e.id));
      }
    }
    const currentTemplateId = changes.search?.currentValue?.templateId;
    const previousTemplateId = changes.search?.previousValue?.templateId;
    const currentCreatedAt = changes.search?.currentValue?.createdAt;
    const previousCreatedAt = changes.search?.previousValue?.createdAt;
    const currentEmployeeType = changes.search?.currentValue?.employeeType;
    const previousEmployeeType = changes.search?.previousValue?.templateId;
    const currentRecipeType = changes.search?.currentValue?.recipeType;
    if (currentCreatedAt &&
      (currentTemplateId !== previousTemplateId
        || currentCreatedAt !== previousCreatedAt
        || currentEmployeeType !== previousEmployeeType
        || currentRecipeType)
    ) {
      this.payrollsSelected = [];
      this.allowPayrollsSelected = [];
      this.isSelectAllowance = false;
      this.isSelectAllPayroll = false;
      this.EventSelectAllowance.emit(this.allowPayrollsSelected);
      this.EventSelectPayroll.emit(this.payrollsSelected);
      this.loading = true
      this.payrollService.paginationPayroll(
        Object.assign(this.mapPayroll(this.formGroup.value), {take: this.pageSize, skip: this.pageIndex}))
        .subscribe(res => {
          this.loading = false
          if (res.data.length > 0) {
            this.totalPayroll = res.total
            this.payrolls = res.data
          }
        })
    }
  }

  ngOnInit(): void {
    this.store.dispatch(PositionActions.loadPosition());

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      this.positions$
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.loading = true;
          this.payrollService.paginationPayroll(
            Object.assign(this.mapPayroll(this.formGroup.value), {
              take: this.pageSize,
              skip: this.pageIndex
            })
          ).subscribe(res => {
            this.loading = false
            this.totalPayroll = res.total
            this.isSelectAllPayroll = checkIsSelectAllInit(res.data, this.payrollsSelected);
            this.isSelectAllowance = checkIsSelectAllInit(res.data, this.allowPayrollsSelected);
            this.payrolls = res.data;
            if (res.data.length > 0) {
              res.data.forEach((payroll: Payroll) => {
                if (this.isSelectAllPayroll) {
                  if (!this.payrollsSelected.some((e) => e.id === payroll.id)) {
                    this.payrollsSelected.push(payroll);
                  }
                  if (this.isSelectAllowance) {
                    if (!this.allowPayrollsSelected.some((e) => e.id === payroll.id)) {
                      this.allowPayrollsSelected.push(payroll);
                    }
                  }
                }
              });
            } else {
              this.isSelectAllPayroll = false;
              this.isSelectAllowance = false
            }
          })
        })
      )
      .subscribe();
  }

  //check-box-payroll
  updateSelectPayroll(payroll: Payroll) {
    const val = pickOne(payroll, this.payrollsSelected, this.payrolls, this.allowPayrollsSelected);
    this.isSelectAllPayroll = val.isSelectAll;
    this.isSelectAllowance = val.isSelectAllowance;
    this.EventSelectPayroll.emit(this.payrollsSelected);
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  someCompleteEmployee(): boolean {
    return (
      this.payrolls.filter((e) => this.payrollsSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllPayroll
    );
  }

  setAllEmployee(select: boolean) {
    this.isSelectAllPayroll = select;
    if (this.payrolls.length === 0) {
      return;
    }
    this.isSelectAllowance = pickAll(
      select,
      this.payrolls,
      this.payrollsSelected,
      this.allowPayrollsSelected,
      this.isSelectAllowance);
    this.EventSelectPayroll.emit(this.payrollsSelected);
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  //check-box-allowance

  updateSelectAllowance(payroll: Payroll) {
    this.isSelectAllowance = pickOne(payroll, this.allowPayrollsSelected, this.payrolls).isSelectAll;
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  someCompleteAllowance(): boolean {
    return (
      this.payrolls.filter((e) => this.allowPayrollsSelected.some(item => item.id === e.id)).length >
      0 && !this.isSelectAllowance
    );
  }

  setAllAllowance(select: boolean) {
    this.isSelectAllowance = select;
    if (select) {
      this.payrolls.forEach(payroll => {
        if (this.allowPayrollsSelected.every(val => val.id !== payroll.id)) {
          this.allowPayrollsSelected.push(payroll)
        }
      })
    } else {
      this.payrolls.forEach(payroll => {
        const indexAllowance = this.allowPayrollsSelected.findIndex(emp => emp.id === payroll.id);
        if (indexAllowance > -1) {
          this.allowPayrollsSelected.splice(indexAllowance, 1)
        }
      })
    }
    this.EventSelectAllowance.emit(this.allowPayrollsSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  selectEmployee(payroll: Payroll) {
    return this.payrollsSelected.some((e) => e.id === payroll.id);
  }

  selectAllowanceEmployee(payroll: Payroll) {
    return this.allowPayrollsSelected.some((e) => e.id === payroll.id);
  }

  onScroll() {
    const val = this.formGroup.value;
    this.loadMore = true
    this.payrollService.paginationPayroll(Object.assign(val, {
        take: this.pageSize,
        skip: this.payrolls.length,
        templateId: this.search.templateId || '',
        employeeType: this.search.employeeType || '',
        recipeType: this.search.recipeType || '',
        isLeave: false,
        createdAt: new Date(this.search.createdAt),
      }
    )).subscribe(respone => {
      if (respone.data.length > 0) {
        respone.data.map(payroll => {
          if (this.isSelectAllPayroll) {
            if (this.payrollsSelected.every(val => val.id !== payroll.id)) {
              this.payrollsSelected.push(payroll)
            }
            if (this.isSelectAllowance) {
              if (this.allowPayrollsSelected.every(val => val.id !== payroll.id)) {
                this.allowPayrollsSelected.push(payroll)
              }
            }
          }
        })
        this.payrolls = this.payrolls.concat(respone.data)
        this.EventSelectAllowance.emit(this.allowPayrollsSelected)
        this.EventSelectPayroll.emit(this.payrollsSelected)
      } else {
        this.message.warning('Đã lấy hết phiếu lương')
      }
      this.loadMore = false
    })
  }

  mapPayroll(val: any) {
    const value = {
      name: val.name,
      position: val.position,
      code: val.code,
      createdAt: new Date(this.search.createdAt),
      templateId: this.search.templateId,
      employeeType: this.search.employeeType,
      recipeType: this.search.recipeType,
      isLeave: false
    };
    if (!this.search.recipeType){
      delete value.recipeType
    }
    if (!this.search.templateId){
      delete value.templateId
    }
    if (!this.search.employeeType){
      delete value.employeeType
    }
    return value
  }
}
