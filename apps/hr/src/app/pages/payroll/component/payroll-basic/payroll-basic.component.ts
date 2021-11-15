import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DatetimeUnitEnum, Gender, SearchTypeEnum } from '@minhdu-fontend/enums';
import { SearchTypeConstant } from '@minhdu-fontend/constants';
import { PayrollSalary } from '../../../../../../../../libs/data-models/hr/salary/payroll-salary';
import { select, Store } from '@ngrx/store';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import { AppState } from '../../../../reducers';
import { TemplateOvertimeAction } from '../../../template/+state/template-overtime/template-overtime.action';
import { debounceTime } from 'rxjs/operators';
import { Salary } from '@minhdu-fontend/data-models';
import { setAllSalary, someCompleteSalary, updateSelectSalary } from '../../utils/pick-salary';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { SalaryService } from '../../service/salary.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payroll-basic',
  templateUrl: 'payroll-basic.component.html'
})
export class PayrollBasicComponent implements OnInit {
  pageType = PageTypeEnum;
  @Input() createdAt!: Date;
  @Input() basicTitle?: string;
  @Output() EventSelectMonth = new EventEmitter<Date>();
  formGroup = new FormGroup({
    title: new FormControl(''),
    name: new FormControl(''),
    startAt: new FormControl(),
    endAt: new FormControl(),
    searchType: new FormControl(SearchTypeEnum.CONTAINS)
  });
  templateBasic$ = new Subject<any>();
  searchTypeConstant = SearchTypeConstant;
  loaded = false;
  genderType = Gender;
  unit = DatetimeUnitEnum;
  salariesBasic!: PayrollSalary;
  salaryIds: number[] = [];
  isSelectSalary = false;
  salaries: Salary[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly salaryService: SalaryService,
    private readonly snackbar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.formGroup.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
        if ((value.startAt && value.endAt)) {
          this.loaded = false;
          const params = {
            searchType: value.searchType,
            startAt: new Date(value.startAt),
            endAt: new Date(value.endAt),
            title: value.title,
            name: value.name
          };
          if (!value.name) {
            delete params.name;
          }
          this.isSelectSalary = false;
          this.salaryIds = [];
          this.salaries = [];
          this.EventSelectMonth.emit(new Date(value.startAt));
        }
      }
    );
  }

  readPayroll(overtime: any) {

  }

  addSalaryBasic() {

  }

  updateSalaryBasic($event: any) {

  }

  deleteSalaryBasic(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        const value = this.formGroup.value;
        const payrollBasic = {
          searchType: value.searchType,
          startAt: new Date(value.startAt),
          endAt: new Date(value.endAt),
          title: value.title,
          name: value.name
        };
        if (!value.name) {
          delete payrollBasic.name;
        }
        this.salaryService.delete(event.id).subscribe((val: any) => {
          if (val) {
            this.snackbar.open('Xóa phiếu lương thành công', '', { duration: 1500 });
          }
        });
      }
    });
  }

  onSelectTemplateBasic($event: any, title: string) {

  }


  updateSelectSalary(id: number) {
    if (this.salariesBasic) {
      updateSelectSalary(id, this.salaryIds, this.isSelectSalary, this.salaries);
    }
  }

  someCompleteSalary(): boolean {
    if (!this.salaries) {
      return false;
    } else {
      return someCompleteSalary(this.salaries, this.salaryIds, this.isSelectSalary);
    }
  }

  setAllSalary(select: boolean) {
    if (this.salariesBasic) {
      setAllSalary(select, this.isSelectSalary, this.salaries, this.salaryIds);
    }
  }
}
