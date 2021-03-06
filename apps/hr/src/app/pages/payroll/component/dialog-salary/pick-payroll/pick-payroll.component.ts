import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  getAllPosition,
  PositionActions,
} from '@minhdu-fontend/orgchart-position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import {
  checkIsSelectAllInit,
  getFirstDayInMonth,
  getLastDayInMonth,
  handleValSubPickItems,
  pickAll,
  pickOne,
  searchAutocomplete,
  someComplete,
} from '@minhdu-fontend/utils';
import { Payroll } from '../../../+state/payroll/payroll.interface';
import { PayrollService } from '../../../service/payroll.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pick-payroll',
  templateUrl: './pick-payroll.component.html',
})
export class PickPayrollComponent implements OnInit, OnChanges {
  @Input() payrollInit?: Payroll;
  @Input() createdAt!: Date;
  @Input() payrollsSelected: Payroll[] = [];
  @Output() EventSelectPayroll = new EventEmitter<Payroll[]>();

  pageSize = 20;
  pageIndex = 0;
  pageSizeTable = 5;
  type = SalaryTypeEnum;
  payrollS: Payroll[] = [];
  isSelectAll = false;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  loading = true;
  total = 0;

  formGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    position: new UntypedFormControl('', Validators.required),
    branch: new UntypedFormControl('', Validators.required),
  });
  loadMore = false;

  constructor(
    private readonly store: Store,
    private readonly payrollService: PayrollService,
    private readonly message: NzMessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.payrollsSelected) {
      this.isSelectAll =
        this.payrollS.length > 1 &&
        this.payrollS.every((e) =>
          this.payrollsSelected.some((item) => item.id === e.id)
        );
    }

    if (changes.createdAt?.previousValue !== changes.createdAt?.currentValue) {
      this.isSelectAll = false;
      this.payrollsSelected = [];
      this.EventSelectPayroll.emit(this.payrollsSelected);
      this.loading = false;
      this.payrollService
        .paginationPayroll(
          Object.assign(this.mapPayroll(this.formGroup.value), {
            take: this.pageSize,
            skip: this.pageIndex,
            startedAt: getFirstDayInMonth(
              new Date(changes.createdAt.currentValue)
            ),
            endedAt: getLastDayInMonth(
              new Date(changes.createdAt.currentValue)
            ),
          })
        )
        .subscribe((res) => {
          if (res.data.length === 0) {
            this.isSelectAll = false;
          }
          this.total = res.total;
          this.payrollS = res.data;
          this.loading = false;
        });
    }
  }

  ngOnInit(): void {
    if (this.payrollInit) {
      this.payrollsSelected.push(this.payrollInit);
      this.EventSelectPayroll.emit(this.payrollsSelected);
    }
    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          Object.assign(val, {
            take: this.pageSize,
            skip: this.pageIndex,
            startedAt: getFirstDayInMonth(new Date(this.createdAt)),
            endedAt: getLastDayInMonth(new Date(this.createdAt)),
          });
          this.payrollService.paginationPayroll(val).subscribe((res) => {
            this.isSelectAll = checkIsSelectAllInit(
              res.data,
              this.payrollsSelected
            );
            this.payrollS = handleValSubPickItems(
              res.data,
              this.payrollS,
              this.payrollsSelected,
              this.isSelectAll
            );
            this.EventSelectPayroll.emit(this.payrollsSelected);
          });
        })
      )
      .subscribe();

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')?.valueChanges.pipe(startWith('')) ||
        of(''),
      this.store.pipe(select(getAllPosition))
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')?.valueChanges.pipe(startWith('')) || of(''),
      this.branches$
    );
  }

  updateSelect(payroll: Payroll) {
    this.isSelectAll = pickOne(
      payroll,
      this.payrollsSelected,
      this.payrollS
    ).isSelectAll;
    this.EventSelectPayroll.emit(this.payrollsSelected);
  }

  someComplete(): boolean {
    return someComplete(this.payrollS, this.payrollsSelected, this.isSelectAll);
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    pickAll(select, this.payrollS, this.payrollsSelected);
    this.EventSelectPayroll.emit(this.payrollsSelected);
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }

  onScroll() {
    const val = this.formGroup.value;
    this.loadMore = true;
    this.payrollService
      .paginationPayroll(
        Object.assign(this.mapPayroll(val), {
          take: this.pageSize,
          skip: this.payrollS.length,
        })
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.total = res.total;
        if (res.data.length > 0) {
          this.payrollS = this.payrollS.concat(res.data);
          if (this.isSelectAll) {
            res.data.forEach((payroll: Payroll) => {
              if (this.payrollsSelected.every((val) => val.id !== payroll.id))
                this.payrollsSelected.push(payroll);
            });
          }
          this.EventSelectPayroll.emit(this.payrollsSelected);
        } else {
          this.message.warning('???? l???y h???t phi???u l????ng');
        }
        this.loadMore = false;
      });
  }

  mapPayroll(val: any) {
    return {
      name: val.name,
      position: val.position,
      branch: val.branch,
      startedAt: getFirstDayInMonth(new Date(this.createdAt)),
      endedAt: getLastDayInMonth(new Date(this.createdAt)),
      empStatus: 0,
    };
  }

  checkEmployee(payroll: Payroll) {
    return this.payrollsSelected.some((e) => e.id === payroll.id);
  }
}
