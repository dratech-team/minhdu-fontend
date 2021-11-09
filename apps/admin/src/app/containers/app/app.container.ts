import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMinhDuConstant } from '../../../constant/app-minh-du.constant';

@Component({
  templateUrl: 'app.container.html',
  styleUrls: ['app.container.scss'],
})
export class AppContainer implements OnInit {
  appMinhDuConstant = AppMinhDuConstant;
  constructor(private readonly router: Router) {}
  ngOnInit() {}
}
