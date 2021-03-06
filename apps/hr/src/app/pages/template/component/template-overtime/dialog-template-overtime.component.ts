import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum, EmployeeType } from '@minhdu-fontend/enums';
import {
  getAllPosition,
  PositionActions,
} from 'libs/orgchart/src/lib/+state/position';
import { startWith } from 'rxjs/operators';
import { PositionService } from '@minhdu-fontend/orgchart';
import { BranchService } from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { ReqOvertime } from '../../+state/template-overtime/template-overtime.interface';
import * as lodash from 'lodash';
import { selectTemplateAdded } from '../../+state/template-overtime/template-overtime.selector';
import { searchAndAddAutocomplete } from '@minhdu-fontend/utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TemplateOverConstant } from '../../constants';
import { salaryReference } from '../../enums';

@Component({
  templateUrl: 'dialog-template-overtime.component.html',
})
export class DialogTemplateOvertimeComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  @ViewChild('branchInput') branchInput!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  branchesSelected: Branch[] = [];
  positionSelected: Position[] = [];
  positions = new UntypedFormControl();
  branches = new UntypedFormControl();
  typeUnit = DatetimeUnitEnum;
  employeeTypeEnum = EmployeeType;
  formGroup!: UntypedFormGroup;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  submitted = false;
  templateOverConstant = TemplateOverConstant;
  priceTypeEnum = salaryReference;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<DialogTemplateOvertimeComponent>,
    private readonly positionService: PositionService,
    private readonly branchService: BranchService,
    private readonly message: NzMessageService
  ) {}

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.template?.branches) {
      this.branchesSelected = [...this.data.template.branches];
    }
    if (this.data?.template?.positions) {
      this.positionSelected = [...this.data.template.positions];
    }
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        title: [this.data?.template?.title, Validators.required],
        employeeType: [
          this.data?.template?.employeeType
            ? this.data?.template?.employeeType
            : EmployeeType.FULL_TIME,
          Validators.required,
        ],
        price: [this.data?.template?.price],
        priceType: [
          this.data?.template?.price
            ? salaryReference.PRICE
            : salaryReference.STANDARD,
          Validators.required,
        ],
        unit: [this.data?.template?.unit, Validators.required],
        rate: [
          this.data?.template?.rate ? this.data.template.rate : 1,
          Validators.required,
        ],
        note: [this.data?.template?.note],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: ['', Validators.required],
        employeeType: [EmployeeType.FULL_TIME, Validators.required],
        price: [''],
        priceType: [salaryReference.PRICE, Validators.required],
        unit: ['', Validators.required],
        rate: [1, Validators.required],
        note: [''],
      });
    }

    this.formGroup.get('employeeType')?.valueChanges.subscribe((val) => {
      if (val === EmployeeType.SEASONAL) {
        this.formGroup.get('unit')?.patchValue(DatetimeUnitEnum.HOUR);
        this.formGroup.get('priceType')?.patchValue(salaryReference.PRICE);
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
      this.branchesSelected = this.data?.branch;
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
    if (this.positionSelected.length === 0) {
      return this.message.error('Ch??a ch???n ch???c v???');
    }
    if (this.positions.value) {
      return this.message.error('Ch???c v??? ph???i ch???n kh??ng ???????c nh???p');
    }
    if (this.branches.value) {
      return this.message.error('????n v??? ph???i ch???n kh??ng ???????c nh???p');
    }
    const value = this.formGroup.value;
    if (value.priceType === salaryReference.PRICE && !value.price) {
      return this.message.error('Ch??a nh???p m???c t??ng ca');
    }
    const template = {
      title: value.title,
      employeeType: value.employeeType,
      positionIds: this.positionSelected.map((val) => val.id),
      branchIds: this.branchesSelected?.map((val) => val.id),
      unit: value.unit,
      note: value.note,
      rate: value.rate,
      price:
        value.priceType === salaryReference.PRICE
          ? typeof value.price === 'string'
            ? Number(value.price.replace(this.numberChars, ''))
            : value.price
          : null,
    } as ReqOvertime;
    if (this.data?.isUpdate) {
      this.store.dispatch(
        TemplateOvertimeAction.updateTemplate({
          id: this.data.template.id,
          templateOvertime: template,
        })
      );
    } else {
      this.store.dispatch(
        TemplateOvertimeAction.AddTemplate({ template: template })
      );
    }
    this.store.pipe(select(selectTemplateAdded)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onCreatePosition(event: any, position: Position, positionInput: HTMLElement) {
    if (event.isUserInput) {
      if (position.id) {
        if (this.positionSelected.some((item) => item.id === position.id)) {
          this.message.success('ch???c v??? ???? ???????c ch???n');
        } else {
          this.positionSelected.push(position);
        }
      } else {
        this.positionService
          .addOne({
            name: this.inputPosition.nativeElement.value,
          })
          .subscribe((position) => this.positionSelected.push(position));
        this.message.success('???? t???o');
      }
      setTimeout(() => {
        this.positions.setValue('');
        positionInput.blur();
      });
    }
  }

  onCreateBranch(event: any, branchInput: HTMLElement, branch?: Branch) {
    if (event.isUserInput) {
      if (branch?.id === 0) {
        this.branchService
          .addOne({ name: this.branchInput.nativeElement.value })
          .subscribe((branch) => this.branchesSelected?.push(branch));
        this.message.success('???? t???o');
      } else {
        if (branch) this.branchesSelected?.push(branch);
      }
      setTimeout(() => {
        this.branches.setValue('');
        branchInput.blur();
      });
    }
  }

  removePosition(position: Position) {
    lodash.remove(this.positionSelected, position);
  }

  onRemoveBranch(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }
}
