import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, ItemContextMenu, sortTypeEnum } from '@minhdu-fontend/enums';
import { OvertimeService } from '../../service/overtime.service';
import { DialogManConfirmedAtComponent } from '../dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { Observable } from 'rxjs';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { DatePipe } from '@angular/common';
import { checkInputNumber } from '@minhdu-fontend/utils';
import { MatSort } from '@angular/material/sort';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-payroll-time-sheet',
  templateUrl: 'payroll-time-sheet.component.html'
})
export class PayrollTimeSheetComponent implements AfterContentChecked {
  @Input() loaded$?: Observable<boolean>;
  @Input() total$?: Observable<number>;
  @Input() daysInMonth: any[] = [];
  @Input() positions$!: Observable<Position[]>;
  @Input() branches$!: Observable<Branch[]>;
  @Input() payroll$!: Observable<Payroll[]>;
  @Output() EventScroll = new EventEmitter<any>();
  @Output() EventSelectPosition = new EventEmitter<string>();
  @Output() EventSelectBranch = new EventEmitter<string>();
  @Output() EventAddPayroll = new EventEmitter<any>();
  @Output() EventReadPayroll = new EventEmitter<any>();
  @Output() EventRestorePayroll = new EventEmitter<any>();
  @Output() EventHistoryPayroll = new EventEmitter<any>();
  @Output() EventSearchMonth = new EventEmitter<Date>();
  @Output() EventDeletePayroll = new EventEmitter<any>();
  @Output() EventSortPayroll = new EventEmitter<MatSort>();
  sortEnum = sortTypeEnum;
  @ViewChild(MatSort) sort!: MatSort;

  unit = DatetimeUnitEnum;
  ItemContextMenu = ItemContextMenu;
  @Input() formGroup!: FormGroup;

  constructor(
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private ref: ChangeDetectorRef
  ) {
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
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

  historyPayroll(event: any) {
    this.EventHistoryPayroll.emit(event);
  }

  deletePayroll(event: any) {
    this.EventDeletePayroll.emit(event);
  }

  onSelectBranch(branchName: string) {
    this.EventSelectBranch.emit(branchName);
  }


  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }

  sortPayroll() {
    this.EventSortPayroll.emit(this.sort);
  }
}
