import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MigrateService } from './services/migrate.service';
import { CommonModule } from '@angular/common';
import { MigrateRoutingModule } from './migrate-routing.module';
import { MigrateComponent } from './containers';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    MigrateRoutingModule
  ],
  declarations: [MigrateComponent],
  providers: [MigrateService],
  exports: [MigrateComponent]
})
export class MigrateModule {
}
