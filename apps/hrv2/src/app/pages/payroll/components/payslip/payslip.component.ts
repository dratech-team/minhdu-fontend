import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { EmployeeType, RecipeType } from '@minhdu-fontend/enums';
import { UntypedFormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { catchError } from 'rxjs/operators';
import { Role } from '@minhdu-fontend/enums';
import { PayrollEntity } from '../../entities';
import { PayslipService } from '../../services/payslip.service';
import { PayrollService } from '../../services/payroll.service';
import { Actions } from '@datorama/akita-ng-effects';
import { PayrollActions } from '../../state/payroll.action';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { getLastDayInMonth } from '@minhdu-fontend/utils';
import { PayrollQuery } from '../../state';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'payslip.component.html',
  styleUrls: ['payslip.component.scss'],
})
export class PayslipComponent implements OnInit {
  @Input() data!: {
    payroll: PayrollEntity;
  };
  payslip$ = this.payslipService.getOne(this.data.payroll.id);
  loading$ = this.payrollQuery.select((state) => state.loading);

  accConfirmedAt = new UntypedFormControl('');
  recipeType = RecipeType;
  isConfirmed = false;
  typeEmployee = EmployeeType;
  currentUser = this.accountQuery.getCurrentUser();
  adding = false;

  constructor(
    private readonly actions$: Actions,
    private readonly payslipService: PayslipService,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly message: NzMessageService,
    private readonly payrollService: PayrollService,
    private readonly modalRef: NzModalRef,
    private readonly payrollQuery: PayrollQuery,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit() {
    if (this.data?.payroll?.accConfirmedAt) {
      this.isConfirmed = true;
      this.accConfirmedAt.setValue(
        this.datePipe.transform(this.data.payroll.accConfirmedAt, 'yyyy-MM-dd')
      );
    } else {
      this.accConfirmedAt.setValue(
        this.datePipe.transform(
          getLastDayInMonth(new Date(this.data.payroll.createdAt)),
          'yyyy-MM-dd'
        )
      );
    }
  }

  confirmPayroll(reconfirm: boolean): any {
    if (this.currentUser?.role?.role === Role.HUMAN_RESOURCE) {
      this.modalRef.close();
      return this.message.warning(
        'Qu???n l?? nh??n s??? kh??ng ???????c ph??p x??c nh???n phi???u l????ng'
      );
    }
    if (this.accConfirmedAt.value) {
      if (reconfirm) {
        this.dialog
          .open(DialogSharedComponent, {
            width: '400px',
            data: {
              title: 'X??c nh???n phi???u l????ng',
              description:
                'Vi???c X??c nh???n phi???u l????ng s??? l??m ????ng b??ng c??c thao t??c tr??n phi???u l????ng, b???n c?? ch???c ch???n mu???n x??c nh???n',
            },
          })
          .afterClosed()
          .subscribe((val) => {
            if (val) {
              this.actions$.dispatch(
                PayrollActions.confirmPayroll({
                  id: this.data.payroll.id,
                  data: { datetime: new Date(this.accConfirmedAt.value) },
                })
              );
            }
          });
      } else {
        this.actions$.dispatch(
          PayrollActions.confirmPayroll({
            id: this.data.payroll.id,
            data: { datetime: new Date(this.accConfirmedAt.value) },
          })
        );
      }
    } else {
      this.message.error('Ch??a ch???n ng??y x??c nh???n phi???u l????ng');
    }
  }

  printPayroll() {
    window.print();
  }

  onCancelPayroll() {
    this.dialog
      .open(DialogSharedComponent, {
        data: {
          title: 'Hu??? x??c nh???n phi???u l????ng',
          description: `B???n c?? ch???c ch???n mu???n hu??? x??c nh???n phi???u l????ng c???a nh??n vi??n ${this.data.payroll.employee.lastName}`,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.adding = true;
        this.payrollService
          .cancelConfirm(this.data.payroll.id)
          .pipe(
            catchError((err) => {
              this.adding = false;
              return throwError(err);
            })
          )
          .subscribe(() => {
            this.adding = false;
            this.message.success('Hu??? x??c nh???n phi???u l????ng th??nh c??ng');
            this.actions$.dispatch(
              PayrollActions.loadOne({ id: this.data.payroll.id })
            );
            this.modalRef.close();
          });
      });
  }
}
