import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum, EmployeeType } from '@minhdu-fontend/enums';
import { getAllPosition, PositionActions } from 'libs/orgchart/src/lib/+state/position';
import { map, startWith } from 'rxjs/operators';
import { PositionService } from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import { BranchService } from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { ReqOvertime } from '../../+state/template-overtime/template-overtime.interface';
import * as lodash from 'lodash';
import { selectTemplateAdded } from '../../+state/template-overtime/template-overtime.selector';
import { searchAndAddAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  templateUrl: 'dialog-template-overtime.component.html'
})
export class DialogTemplateOvertimeComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  @ViewChild('branchInput') branchInput!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  branchSelected?: Branch;
  positionSelected: Position[] = [];
  positions = new FormControl();
  branches = new FormControl();
  typeUnit = DatetimeUnitEnum;
  employeeTypeEnum = EmployeeType;
  formGroup!: FormGroup;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  submitted = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<DialogTemplateOvertimeComponent>,
    private readonly positionService: PositionService,
    private readonly branchService: BranchService,
    private readonly snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.positions) {
      this.positionSelected = [...this.data.positions];
    }
    this.formGroup = this.formBuilder.group({
      title: [this.data?.title, Validators.required],
      employeeType: [this.data?.employeeType ?
        this.data?.employeeType
        : EmployeeType.EMPLOYEE_FULL_TIME, Validators.required],
      price: [this.data?.price, Validators.required],
      unit: [this.data?.unit, Validators.required],
      rate: [this.data?.rate ? this.data.rate : 1, Validators.required],
      note: [this.data?.note]
    });

    this.formGroup.get('employeeType')?.valueChanges.subscribe(val => {
      if (val === EmployeeType.EMPLOYEE_SEASONAL) {
        this.formGroup.get('unit')?.patchValue(DatetimeUnitEnum.HOUR);
      }
    });

    this.positions$ = searchAndAddAutocomplete(
      this.positions.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAndAddAutocomplete(
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$
    );
    if (this.data?.branch) {
      this.branchSelected = this.data?.branch;
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if(this.positionSelected.length === 0){
      return this.snackbar.open('Chưa chọn chức vụ', '', {duration:1500})
    }
    if(this.positions.value){
      return this.snackbar.open('Chức vụ phải chọn không được nhập', '', {duration: 1500})
    }
    if(this.branches.value){
      return this.snackbar.open('đơn vị phải chọn không được nhập', '', {duration: 1500})
    }

    const value = this.formGroup.value;
    const template = {
      isUpdate: !!this.data,
      id: this.data?.id,
      data: {
        title: value.title,
        employeeType: value.employeeType,
        positionIds: this.positionSelected.map(val => val.id),
        branchId: this.branchSelected?.id,
        price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
        unit: value.unit,
        note: value.note,
        rate: value.rate
      } as ReqOvertime
    };
    if (template.isUpdate) {
      this.store.dispatch(TemplateOvertimeAction.updateTemplate({ id: template.id, templateOvertime: template.data }));
    } else {
      this.store.dispatch(TemplateOvertimeAction.AddTemplate({ template: template.data }));
    }
    this.store.pipe(select(selectTemplateAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onCreatePosition(event: any, position: Position, positionInput: HTMLElement) {
    if (event.isUserInput) {
      if (position.id) {
        if (this.positionSelected.some(item => item.id === position.id)) {
          this.snackbar.open('chức vụ đã được chọn', '', { duration: 1000 });
        } else {
          this.positionSelected.push(position);
        }
      } else {
        this.positionService
          .addOne({
            name: this.inputPosition.nativeElement.value
          })
          .subscribe((position) => (
            this.positionSelected.push(position)
          ));
        this.snackbar.open('Đã tạo', '', { duration: 2500 });
      }
      setTimeout(() => {
        this.positions.setValue('');
        positionInput.blur();
      });

    }
  }

  onCreateBranch(event: any,branchInput: HTMLElement, branch?: Branch ) {
    if (event.isUserInput) {
      if (branch?.id === 0) {
        this.branchService
          .addOne({ name: this.branchInput.nativeElement.value })
          .subscribe((branch) => (this.branchSelected = branch));
        this.snackbar.open('Đã tạo', '', { duration: 2500 });
      } else {
        this.branchSelected = branch;
      }
      setTimeout(() => {
        this.branches.setValue('')
        branchInput.blur()
      });

    }
  }

  removePosition(position: Position) {
    lodash.remove(this.positionSelected, position);
  }
}
