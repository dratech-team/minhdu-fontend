import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllRoute } from '../+state/Route.selector';
import { RouteAction } from '../+state/route.action';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { Router } from '@angular/router';
import { document } from 'ngx-bootstrap/utils';
import { debounceTime, tap } from 'rxjs/operators';
import { DownloadService } from 'libs/service/download.service';
import { ExportService } from 'libs/service/export.service';
import { TypeFile } from '@minhdu-fontend/enums';
import { Api } from '@minhdu-fontend/constants';


@Component({
  templateUrl: 'route.component.html'
})
export  class RouteComponent implements OnInit {
  pageIndex = 1;
  pageSize = 30;
  formGroup = new FormGroup(
    {
      skip: new FormControl(''),
      take: new FormControl(''),
      startedAt: new FormControl(''),
      endedAt: new FormControl(''),
      driver: new FormControl(''),
      name: new FormControl(''),
      bsx:  new FormControl(''),
    }
    );
  routes$ = this.store.pipe(select(selectorAllRoute))
  constructor(
      private readonly store: Store<AppState>,
      private readonly dialog: MatDialog,
      private readonly router: Router,
      private readonly downloadService: DownloadService,
      private readonly exportService: ExportService,
  ) {
  }
  ngOnInit() {
    const btnRoute = document.getElementById('route')
    btnRoute?.classList.add('btn-border')
    document.getElementById('customer').classList.remove('btn-border')
    document.getElementById('order').classList.remove('btn-border')
    this.store.dispatch(RouteAction.loadInit({take:30, skip: 0}))
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(RouteAction.loadInit(this.route(val, 30, 0 )));
      })
    ).subscribe()
  }
  add(){
    this.dialog.open(RouteDialogComponent, {
      width: '55%',
    })
  }
  onScroll(){
    const val = this.formGroup.value
   this.store.dispatch(RouteAction.loadMoreRoutes(this.route(val,this.pageSize, this.pageIndex)))
  }
  route(val: any, pageSize: number, pageIndex: number){
    return {
      skip: pageSize *pageIndex++,
      take: pageSize,
      name: val.name.trim(),
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      driver: val.driver.trim(),
      bsx: val.bsx.trim(),
    }
  }

  deleteRoute($event: any){
      this.store.dispatch(RouteAction.deleteRoute({idRoute: $event.id}))
  }
  detailRoute(id: number){
    this.router.navigate(['/ban-hang/tuyen-duong/chi-tiet-tuyen-duong',id]).then()
  }

  printRouter() {
    const val = this.formGroup.value;
    const route = {
      name: val.name.trim(),
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      driver: val.driver.trim(),
      bsx: val.bsx.trim(),
    }
    this.exportService.print(Api.ROUTE_EXPORT, route).subscribe(res =>{
        console.log(res)
        const fileName =  res.headers.get('content-disposition')
        const type = TypeFile.EXCEL
        this.downloadService.downloadFile(res.body, type, fileName)
    }
    )
  }

}
