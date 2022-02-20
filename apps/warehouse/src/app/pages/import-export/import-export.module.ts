import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ImportExportService } from './services/import-export.service';
import { ImportExportComponent } from './containers/import-export.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule
  ],
  declarations: [ImportExportComponent],
  providers: [ImportExportService],
  exports: [ImportExportComponent]
})
export class ImportExportModule {
}
