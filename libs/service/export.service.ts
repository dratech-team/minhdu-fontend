import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(public readonly http: HttpClient) {}

  print(url: string, params?: any) {
    return this.http
      .get(url, { params, responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }
}
