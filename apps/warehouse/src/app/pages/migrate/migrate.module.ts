import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MigrateService } from './services/migrate.service';
import { CommonModule } from '@angular/common';
import { MigrateRoutingModule } from './migrate-routing.module';
import { MigrateComponent } from './containers';
import {ImportCommodityComponent} from "./components/import-commodity/import-commodity.component";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    MigrateRoutingModule,
    NzCollapseModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [MigrateComponent,ImportCommodityComponent],
  providers: [MigrateService],
  exports: [MigrateComponent]
})
export class MigrateModule {
}
