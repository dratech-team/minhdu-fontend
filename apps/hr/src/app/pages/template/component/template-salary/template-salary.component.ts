import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {TemplateSalaryAction} from '../../+state/teamlate-salary/template-salary.action';
import {selectTemplateAdded} from '../../+state/teamlate-salary/template-salary.selector';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {Branch} from '@minhdu-fontend/data-models';
import * as lodash from 'lodash';
import {searchAutocomplete} from '@minhdu-fontend/utils';
import {startWith} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PriceTypeConstant} from "../../constants/price-type.constant";
import {PriceTypeEnum} from "../../enums";
import {BlockSalariesConstant} from "../../constants";

@Component({
  templateUrl: 'template-salary.component.html'
})
export class TemplateSalaryComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: FormGroup;
  submitted = false;
  salaryTypeEnum = SalaryTypeEnum;
  blockSalary = BlockSalariesConstant;
  priceTypeConstant = PriceTypeConstant
  branches = new FormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchesSelected: Branch[] = [];
  priceTypeEnum = PriceTypeEnum
  compareFN = (o1: any, o2: any) => (o1.type == o2.type || o1 === o2.type);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<TemplateSalaryComponent>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.template) {
      if (this.data.template?.branches) {
        this.branchesSelected = [...this.data.template?.branches];
      }
      this.formGroup = this.formBuilder.group({
        block: [this.data.template.type, Validators.required],
        price: [this.data.template.price],
        title: [this.data.template.title],
        priceType: [this.data.template?.priceType],
        days: [],
        rate: [],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        block: ['', Validators.required],
        price: [],
        priceType: [{value: PriceTypeEnum.INPUT}],
        title: [],
        days: [1],
        rate: []
      });
    }

    this.formGroup.get('block')?.valueChanges.subscribe(item => {
      if (item.type === SalaryTypeEnum.OVERTIME || item.type === SalaryTypeEnum.HOLIDAY) {
        this.message.info('Chức năng đang được phát triền')
        this.formGroup.get('block')?.setValue('')
      }
    })

    this.branches$ = searchAutocomplete(
      this.branches.valueChanges.pipe(startWith(this.data?.template?.branch?.name || '')),
      this.branches$
    );
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.branches.value) {
      return this.message.error('Đơn vị phải chọn không được nhập');
    }
    const value = this.formGroup.value;
    const template = {
      title: value.title,
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      type: value.block.type,
      branchIds: this.branchesSelected.map(val => val.id)
    };
    if (this.data?.isUpdate) {
      this.store.dispatch(TemplateSalaryAction.updateTemplate(
        {
          id: this.data.template.id,
          template: template
        }));
    } else {
      this.store.dispatch(TemplateSalaryAction.AddTemplate(
        {template: template}));
    }
    this.store.pipe(select(selectTemplateAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close(template);
      }
    });
  }

  onSelectBranch(event: any, branch: Branch, branchesInput: HTMLInputElement) {
    if (event.isUserInput) {
      if (branch.id) {
        if (this.branchesSelected.some(item => item.id === branch.id)) {
          this.message.success('Đơn vị đã được chọn');
        } else {
          this.branchesSelected.push(branch);
        }
      }
      setTimeout(() => {
        this.branches.setValue('');
        branchesInput.blur();
      });
    }
  }

  removeBranchSelected(branch: Branch) {
    lodash.remove(this.branchesSelected, branch);
  }

}
