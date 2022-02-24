import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {getAllOrgchart} from "@minhdu-fontend/orgchart";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  templateUrl: 'incubator-factory.component.html'
})
export class incubatorFactoryComponent  implements OnInit{
  constructor(
    private storeNgrx: Store
  ) {
  }
  branches$ = this.storeNgrx.select(getAllOrgchart)
  formGroup = new FormGroup({
    branch: new FormControl('')
  });  ngOnInit() {
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }}
