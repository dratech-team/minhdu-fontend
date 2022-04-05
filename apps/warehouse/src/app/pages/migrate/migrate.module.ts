import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MigrateService } from './services/migrate.service';
import { CommonModule } from '@angular/common';
import { MigrateRoutingModule } from './migrate-routing.module';
import { MigrateComponent } from './containers';
import {ImportCommodityComponent} from "./components/import-commodity/import-commodity.component";

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    MigrateRoutingModule
  ],
  declarations: [MigrateComponent,ImportCommodityComponent],
  providers: [MigrateService],
  exports: [MigrateComponent]
})
export class MigrateModule {
}
