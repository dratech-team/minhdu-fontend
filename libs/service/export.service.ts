import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { VersionEnum } from '../enums';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(public readonly http: HttpClient) {}

  print(url: string, params?: any, body?: any): Observable<boolean> {
    let success = new Subject<boolean>();
    this.http
      .post(VersionEnum.V2 + url, body, {
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        catchError((err) => {
          success.next(false);
          return throwError(err);
        })
      )
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
        success.next(true);
      });
    return success;
  }
}
