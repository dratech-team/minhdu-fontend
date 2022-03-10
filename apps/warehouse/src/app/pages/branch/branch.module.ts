import {NgModule} from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BranchRoutingModule} from "./branch-routing.module";
import {BranchComponent} from "./container/branch.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {NzTableModule} from "ng-zorro-antd/table";
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
  declarations: [BranchComponent],
  imports: [
    StoreModule,
    EffectsModule,
    InfiniteScrollModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BranchRoutingModule,
    MatExpansionModule,
    NzTableModule,
    MatRadioModule
  ],

})
export class BranchModule {
}
