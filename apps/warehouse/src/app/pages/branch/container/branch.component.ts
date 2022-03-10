import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {getAllOrgchart, OrgchartActions} from "@minhdu-fontend/orgchart";

@Component({
  templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  formGroup = new FormGroup({
    search: new FormControl(),
    status: new FormControl(-1),
  })
  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
  }

  onScroll() {

  }
}
