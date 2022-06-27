import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {DatePipe} from '@angular/common';
import {getAllOrgchart} from "@minhdu-fontend/orgchart";
import {Branch, Category, Employee} from "@minhdu-fontend/data-models";
import {MatSnackBar} from "@angular/material/snack-bar";
import {searchAutocomplete} from "@minhdu-fontend/utils";
import {startWith} from "rxjs/operators";
import {ProvinceAction} from "@minhdu-fontend/location";
import {CategoryService} from "../../../../../../../../libs/employee/src/lib/+state/service/category.service";


@Component({
  templateUrl: 'dialog-category.component.html'
})

export class DialogCategoryComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  submitted = false;
  branches = new UntypedFormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchSelected?: Branch
  tabIndex = 0;
  categoryInit?: Category

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogCategoryComponent>,
    private readonly categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    if (this.data?.isUpdate) {
      this.categoryService.getOne(this.data.categoryId).subscribe(val => {
        if (val) {
          this.categoryInit = val;
          this.branchSelected = val.branch;
          this.formGroup.get('name')?.setValue(val.name)
          this.formGroup.get('note')?.setValue(val.note)
        }
      })
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        note: [''],
        employeeIds: ['']
      });
    } else {
      this.branches$.subscribe(val =>{
        if (val.length === 1){
          this.branchSelected = val[0]
        }
      })
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        note: [],
        employeeIds: ['']
      });
    }


    this.branches$ = searchAutocomplete(
      this.branches.valueChanges.pipe(startWith(this.data?.branch?.name || '')),
      this.branches$
    );
  }


  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const category = {
      name: value.name,
      note: value?.note,
      branchId: this.branchSelected?.id,
      employeeIds: value.employeeIds
    };
    if (this.data?.isUpdate) {
      this.categoryService.update(this.categoryInit?.id, category).subscribe(val => {
        if (val) {
          this.dialogRef.close()
        }
      })
    } else {
      this.categoryService.addOne(category).subscribe(val => {
        if (val) {
          this.dialogRef.close()
        }
      })
    }
  }

  onSelectBranch(event: any, branch: Branch, branchesInput: HTMLInputElement) {
    if (event.isUserInput) {
      this.branchSelected = branch
      setTimeout(() => {
        this.branches.setValue('');
        branchesInput.blur();
      });
    }
  }

  nextTab(tab: any) {
    this.submitted = true
    if (this.formGroup.invalid || !this.branchSelected) {
      return
    }
    this.tabIndex = tab._selectedIndex + 1;

  }

  previousTab(tab: any) {
    this.tabIndex = tab._selectedIndex - 1;
  }

  selectTab(tab: any) {
    if (tab.index !== 0) {
      this.submitted = true
      if (this.formGroup.invalid || !this.branchSelected)
        this.tabIndex = 0
    }
  }
}
