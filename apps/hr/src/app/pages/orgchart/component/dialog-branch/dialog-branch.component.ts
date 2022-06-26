import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {getAllPosition, PositionActions} from '@minhdu-fontend/orgchart-position';
import {getBranchAdded, OrgchartActions, PositionService} from '@minhdu-fontend/orgchart';
import {Branch, Position} from '@minhdu-fontend/data-models';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as lodash from 'lodash';
import {searchAndAddAutocomplete} from '@minhdu-fontend/utils';
import {startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  templateUrl: 'dialog-branch.component.html'
})
export class DialogBranchComponent implements OnInit {
  @ViewChild('positionInput') inputPosition!: ElementRef;
  formGroup!: UntypedFormGroup;
  submitted = false;
  positionSelected: Position[] = [];
  positions = new UntypedFormControl('');
  positions$ = this.store.pipe(select(getAllPosition));
  branch$?: Observable<Branch | undefined>;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogBranchComponent>,
    private readonly formBuilder: UntypedFormBuilder,
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

  onsubmit(): any {
    this.submitted = true;
    if (this.formGroup.valid) {
      if (this.positions.value) {
        return this.snackBar.open('Chức vụ phải chọn không được nhập', '', {duration: 1500})
      }
      const val = this.formGroup.value;
      if (this.data?.isUpdate) {
        this.store.dispatch(OrgchartActions.updateBranch(
          {
            id: this.data.branch.id, updateBranchDto: {
              name: val.branch,
              positionIds: this.positionSelected.map(val => val.id)
            }
          }));
      } else {
        this.store.dispatch(OrgchartActions.addBranch(
          {branch: {name: val.branch, positionIds: this.positionSelected.map(val => val.id)}}));
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
          this.snackBar.open('chức vụ đã được chọn', '', {duration: 1000});
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
        this.snackBar.open('Đã tạo', '', {duration: 2500});
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
