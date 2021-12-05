import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  getAllPosition,
  PositionActions,
  selectPositionAdded
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getBranchAdded, getBranchById, getSelectedBranchId, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PositionService } from '../../../../../../../../libs/orgchart/src/lib/services/position.service';
import * as lodash from 'lodash';
import { searchAndAddAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'dialog-branch.component.html'
})
export class DialogBranchComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  formGroup!: FormGroup;
  submitted = false;
  positionSelected: Position[] = [];
  positions = new FormControl('');
  positions$ = this.store.pipe(select(getAllPosition));
  branch$?:Observable<Branch|undefined>
  constructor(
    private readonly dialogRef: MatDialogRef<DialogBranchComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly snackBar: MatSnackBar,
    private readonly positionService: PositionService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    if (this.data?.isUpdate) {
      this.positionSelected = [...this.data.branch.positions];
      this.formGroup = this.formBuilder.group({
        branch: [this.data.branch.name]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        branch: [undefined, Validators.required]
      });
    }
    this.positions$ = searchAndAddAutocomplete(
      this.positions.valueChanges.pipe(startWith('')),
      this.positions$
    );
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit() {
    this.submitted = true;
    if (this.formGroup.valid) {
      const val = this.formGroup.value;
      if (this.data?.isUpdate) {
        this.store.dispatch(OrgchartActions.updateBranch(
          { id: this.data.branch.id, name: val.branch, positionIds: this.positionSelected.map(val => val.id) }));
      } else {
        this.store.dispatch(OrgchartActions.addBranch(
          { branch: { name: val.branch , positionIds:  this.positionSelected.map(val => val.id) } }));
      }
    } else {
      return;
    }
    this.store.pipe(select(getBranchAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onCreatePosition(event: any, position: any, positionInput: HTMLElement): any {
    if (event.isUserInput) {
      if (position.id) {
        if (this.positionSelected.some(item => item.id === position.id)) {
          this.snackBar.open('chức vụ đã được chọn', '', { duration: 1000 });
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
        this.snackBar.open('Đã tạo', '', { duration: 2500 });
      }
      setTimeout(() => {
          this.positions.setValue('');
          positionInput.blur();
        }
      );
    }
  }

  removePosition(position: Position) {
    lodash.remove(this.positionSelected, position);
  }
}
