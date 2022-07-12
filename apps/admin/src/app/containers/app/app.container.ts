import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { AppInterface } from './app.interface';

@Component({
  templateUrl: 'app.container.html',
  styleUrls: ['app.container.scss'],
})
export class AppContainer implements OnInit {
  appMinhDuConstant$!: Observable<AppInterface[]>;

  constructor(
    private readonly router: Router,
    private readonly appService: AppService
  ) {}

  ngOnInit() {
    this.appMinhDuConstant$ = this.appService.getAll();
  }
}
