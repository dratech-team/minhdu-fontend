import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {getAllOrgchart, getOrgchartLoaded, OrgchartActions} from "@minhdu-fontend/orgchart";
import {Branch} from "@minhdu-fontend/data-models";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogSharedComponent
} from "../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";
import {debounce, debounceTime} from "rxjs/operators";
import {DialogBranchComponent} from "../../branch/components/dialog-branch/dialog-branch.component";
import {ProviderEntity} from "../entities/provider.entity";
import {ProviderQuery} from "../state/provider.query";
import {DialogProviderComponent} from "../components/dialog-provider/dialog-provider.component";

@Component({
  templateUrl: 'provider.component.html'
})
export class ProviderComponent implements OnInit {
  provider$ = this.providerQuery.selectAll()
  formGroup = new FormGroup({
    search: new FormControl(),
    startedAt: new FormControl(),
    endedAt: new FormControl(),
  })
  total$ = this.providerQuery.selectCount()
  loaded$ = this.store.select(getOrgchartLoaded);

  constructor(
    private readonly store: Store,
    public readonly providerQuery: ProviderQuery,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val =>{
      this.store.dispatch(OrgchartActions.searchBranch({search: val?.search, status: val?.status}))
    })
  }

  addProvider() {
    this.dialog.open(DialogProviderComponent, {
      width: 'fit-content',
    })
  }

  updateProvider(provider: ProviderEntity) {
    this.dialog.open(DialogProviderComponent, {
      width: 'fit-content',
      data: {
        provider: provider,
        isUpdate: true
      }
    })
  }

  deleteProvider(provider: ProviderEntity) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá nhà cung cấp',
        description: `bạn có muốn xoá nhà cung cấp ${provider.name}`
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.store.dispatch(OrgchartActions.deleteBranch({id: provider.id}))
        }
      })
  }
}
