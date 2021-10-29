import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { Overtime } from '../../../../../../../../libs/data-models/hr/salary/overtime';
import { OvertimeService } from '../../service/overtime.service';
import { DialogManConfirmedAtComponent } from '../dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { Observable } from 'rxjs';
import { Position } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';

@Component({
  selector: 'app-payroll-time-sheet',
  templateUrl: 'payroll-time-sheet.component.html'
})
export class PayrollTimeSheetComponent implements OnInit{
  @Input() loaded$?: Observable<boolean>;
  @Input() daysInMonth: any[] = [];
  @Input() formGroup!: FormGroup;
  @Input() positions$!: Observable<Position[]>;
  @Input() payroll$!: Observable<Payroll[]>;
  @Output() EventScroll = new EventEmitter<any>();
  @Output() EventSelectPosition = new EventEmitter<string>();
  @Output() EventAddPayroll = new EventEmitter<any>();
  @Output() EventReadPayroll = new EventEmitter<any>();
  @Output() EventRestorePayroll = new EventEmitter<any>();
  unit = DatetimeUnitEnum;
  overtime!: Overtime;
  loaded = false;

  pageType = PageTypeEnum;

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog
  ) {
  }
  ngOnInit() {
  }

  onScroll() {
    this.EventScroll.emit();
  }

  onSelectPosition(positionName: string) {
    this.EventSelectPosition.emit(positionName);
  }


  addPayroll($event?: any): void {
    this.EventAddPayroll.emit($event);
  }

  readPayroll($event: any) {
    this.EventReadPayroll.emit($event);
  }

  updateManConfirm(id: number, manConfirmedAt: any, createdAt?: Date) {
    this.dialog.open(DialogManConfirmedAtComponent, {
      width: 'fit-content',
      data: { id, createdAt, manConfirmedAt: !!manConfirmedAt }
    });
  }

  restorePayroll(event: any) {
    this.EventRestorePayroll.emit(event);
  }
}
