import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';

@Component({
  templateUrl: 'app.container.html',
  styleUrls: ['app.container.scss']
})
export class AppContainer {
  apps$ = this.appService.getAll();

  constructor(
    private readonly router: Router,
    private readonly appService: AppService
  ) {
  }
}
