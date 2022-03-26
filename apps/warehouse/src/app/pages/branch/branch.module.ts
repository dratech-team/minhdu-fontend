import {NgModule} from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BranchRoutingModule} from "./branch-routing.module";
import {BranchComponent} from "./container/branch/branch.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {NzTableModule} from "ng-zorro-antd/table";
import {MatRadioModule} from "@angular/material/radio";
import {ComponentsModule} from "@minhdu-fontend/components";
import {DialogBranchComponent} from "./components/dialog-branch/dialog-branch.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [BranchComponent, DialogBranchComponent],
  imports: [
    ComponentsModule,
    StoreModule,
    EffectsModule,
    InfiniteScrollModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BranchRoutingModule,
    MatExpansionModule,
    NzTableModule,
    MatRadioModule,
    NgxSkeletonLoaderModule,
    MatCheckboxModule,
    MatDialogModule
  ],

})
export class BranchModule {
}
