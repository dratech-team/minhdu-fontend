import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class StatisticalService {
  constructor(
    private readonly snackbar: MatSnackBar,
    public readonly http: HttpClient
  ) {
  }

  getAll(url: string, params: any): Observable<any[]> {
    return this.http.get<any[]>(url, { params }).pipe(tap(() => {
      this.snackbar.open('Thống kê thành công', '', { duration: 1500 });
    }));
  }
}
