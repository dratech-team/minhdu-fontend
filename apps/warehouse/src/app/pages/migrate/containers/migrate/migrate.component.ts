import { Component, OnInit, ViewChild } from '@angular/core';
import { MigrateService } from '../../services/migrate.service';
import { map } from 'rxjs/operators';
import { MigrateEnum } from '../../enums/migrate.enum';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { MigrateEntity } from '../../entities/migrate.entity';

@Component({
  selector: 'minhdu-fontend-import-export',
  templateUrl: 'migrate.component.html'

})
export class MigrateComponent implements OnInit{
  data$ = this.service.pagination({ take: 20, skip: 0 }).pipe(map(e => e.data || []));

  @ViewChild('virtualTable', { static: false }) nzTableComponent?: NzTableComponent<MigrateEntity>;
  MigrateEnum = MigrateEnum;

  constructor(
    private readonly service: MigrateService
  ) {
  }

  ngOnInit(): void {
    console.log('ssss')
    console.log(this.nzTableComponent?.nzScroll?.y)
  }
}
