import { Component, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'minhdu-fontend-hrv2',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('mode=') === -1) {
          this.router.navigate([event.url.split('?')[0]], {
            queryParams: { mode: isDevMode() ? 'info' : 'prod' },
            queryParamsHandling: 'merge'
          }).then();
        }
      }
    });
  }
}
