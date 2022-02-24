import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAllOrgchart } from '@minhdu-fontend/orgchart';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'incubator-factory.component.html'
})
export class IncubatorFactoryComponent {
  branches$ = this.storeNgrx.select(getAllOrgchart);

  formGroup = new FormGroup({
    branch: new FormControl('')
  });

  constructor(
    private storeNgrx: Store
  ) {
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }
}
