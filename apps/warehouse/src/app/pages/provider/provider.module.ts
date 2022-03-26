import {NgModule} from '@angular/core';
import {ProviderService} from './services/provider.service';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {ProviderEffect} from './state/provider.effect';
import {ProviderComponent} from "./container/provider/provider.component";
import {ComponentsModule} from "@minhdu-fontend/components";
import {MatExpansionModule} from "@angular/material/expansion";
import {NzTableModule} from "ng-zorro-antd/table";
import {MatRadioModule} from "@angular/material/radio";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ProviderRoutingModule} from "./provider-routing.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {DialogProviderComponent} from "./components/dialog-provider/dialog-provider.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
  imports: [
    ComponentsModule,
    ProviderRoutingModule,
    MatExpansionModule,
    NzTableModule,
    MatRadioModule,
    NgxSkeletonLoaderModule,
    MatCheckboxModule,
    MatDialogModule,
    AkitaNgEffectsModule.forFeature([ProviderEffect]),
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    InfiniteScrollModule
  ],
  declarations: [ProviderComponent,DialogProviderComponent],
  providers: [ProviderService]
})
export class ProviderModule {
}
