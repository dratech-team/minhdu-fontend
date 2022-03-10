import {NgModule} from '@angular/core';
import {NzTableModule} from 'ng-zorro-antd/table';
import {ImportExportService} from './services/import-export.service';
import {ImportExportComponent} from './containers/import-export/import-export.component';
import {CommonModule} from '@angular/common';
import {ImportExportRoutingModule} from "./import-export-routing.module";

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    ImportExportRoutingModule
  ],
  declarations: [ImportExportComponent],
  providers: [ImportExportService],
  exports: [ImportExportComponent]
})
export class ImportExportModule {
}
