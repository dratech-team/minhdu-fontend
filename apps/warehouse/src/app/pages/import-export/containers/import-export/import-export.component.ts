import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportExportService } from '../../services/import-export.service';
import { map } from 'rxjs/operators';
import { ImportExportEnum } from '../../enums/import-export.enum';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { ImportExportEntity } from '../../entities/import-export.entity';

@Component({
  selector: 'minhdu-fontend-import-export',
  templateUrl: 'import-export.component.html'

})
export class ImportExportComponent implements OnInit{
  data$ = this.service.pagination({ take: 20, skip: 0 }).pipe(map(e => e.data || []));

  @ViewChild('virtualTable', { static: false }) nzTableComponent?: NzTableComponent<ImportExportEntity>;
  ImportExportEnum = ImportExportEnum;

  constructor(
    private readonly service: ImportExportService
  ) {
  }

  ngOnInit(): void {
    console.log('ssss')
    console.log(this.nzTableComponent?.nzScroll?.y)
  }
}
