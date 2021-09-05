import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Api } from '@minhdu-fontend/constants';
import { environment } from 'libs/environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportRouteService {
  constructor(
    public readonly http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  print(endpoint: string): void {
    this.goToLink(environment.apiUrl + endpoint);
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }
}
