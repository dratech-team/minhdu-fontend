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
import {ExportCommodityComponent} from "./components/export-commodity/export-commodity.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    MigrateRoutingModule,
    NzCollapseModule,
    ReactiveFormsModule,
    ComponentsModule,
    NzSelectModule,
    NzInputModule
  ],
    declarations: [MigrateComponent, ImportCommodityComponent, ExportCommodityComponent],
  providers: [MigrateService],
  exports: [MigrateComponent]
})
export class MigrateModule {
}
