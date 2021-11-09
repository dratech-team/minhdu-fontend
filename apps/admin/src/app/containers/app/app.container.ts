import { Component, OnInit } from '@angular/core';
import { AppMinhDuConstant } from '../../../constant/app-minh-du.constant';
import { App } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { environment } from '../../../../../../libs/environments/environment';

@Component({
  templateUrl:'app.container.html',
  styleUrls:['app.container.scss']
})
export class AppContainer implements OnInit{
  appMinhDuConstant = AppMinhDuConstant
  constructor(
    private readonly router: Router
  ) {
  }
  ngOnInit() {
  }

}
