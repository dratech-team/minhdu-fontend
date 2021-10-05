import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
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
import { Branch, Department, Position } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { getAllPosition, PositionActions } from 'libs/orgchart/src/lib/+state/position';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PositionService } from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import { BranchService } from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { ReqOvertime } from '../../+state/template-overtime/template-overtime.interface';
import * as lodash from 'lodash';
import { selectTemplateAdded } from '../../+state/template-overtime/template-overtime.selector';
import { add } from 'ngx-bootstrap/chronos';

@Component({
  templateUrl: 'dialog-template-overtime.component.html'
})
export class DialogTemplateOvertimeComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  @ViewChild('branchInput') branchInput!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  branchId?: number;
  positionSelected: Position[] = [];
  positions = new FormControl();
  branches = new FormControl();
  typeUnit = DatetimeUnitEnum;
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
    if (this.data?.positions) {
      this.positionSelected = [...this.data.positions];
    }
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup = this.formBuilder.group({
      title: [this.data?.title, Validators.required],
      price: [this.data?.price, Validators.required],
      unit: [this.data?.unit, Validators.required],
      rate: [this.data?.rate ? this.data.rate : 1, Validators.required],
      note: [this.data?.note]
    });
    this.positions$ = combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.positions$
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          const result = positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
          if (!result.length) {
            result.push({ id: 0, name: 'Tạo mới chức vụ' });
          }
          return result;
        } else {
          return positions;
        }
      })
    );

    this.branches$ = combineLatest([
      this.branches.valueChanges.pipe(startWith(this.data?.branch?.name||'')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          const result = branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
          if (!result.length) {
            result.push({ id: 0, name: 'Tạo mới đơn vị' });
          }
          return result;
        } else {
          this.branchId = undefined;
          return branches;
        }
      })
    );
    if (this.data?.branch) {
      this.branches.patchValue(this.data?.branch.name);
      this.branchId = this.data?.branch.id;
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
    const value = this.formGroup.value;
    const template = {
      isUpdate: !!this.data,
      id: this.data?.id,
      data: {
        title: value.title,
        positionIds: this.positionSelected.map(val => val.id),
        branchId: this.branchId,
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

  onCreatePosition(position: any) {
    if (position.id) {
      if (this.positionSelected.filter(item => item.id === position.id).length > 0) {
         this.snackbar.open('chức vụ đã được chọn', '', { duration: 1000 });
      }else{
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
    this.positions.patchValue('');
  }

  onCreateBranch(branch?: Branch) {
    if (branch?.id === 0) {
      this.branchService
        .addOne({ name: this.branchInput.nativeElement.value })
        .subscribe((branch) => (this.branchId = branch.id));
      this.snackbar.open('Đã tạo', '', { duration: 2500 });
    } else {
      this.branchId = branch?.id;
    }
  }

  removePosition(position: Position) {
    lodash.remove(this.positionSelected, position);
  }
}
