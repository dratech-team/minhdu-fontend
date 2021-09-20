import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(public readonly http: HttpClient) {}

  print(url: string, params?: any) {
    return this.http
      .get(url, { params, observe: 'response', responseType: 'blob' })
      .subscribe((data) => {
        const link = window.document.createElement('a');

        const fileName = data.headers.get('content-Disposition');
        const blob = new Blob([data.body as BlobPart], {
          type: data.headers.get('content-Type') as string,
        });
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName ? fileName : 'data';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}
