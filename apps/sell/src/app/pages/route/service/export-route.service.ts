import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
@Injectable({providedIn: 'root'})
export  class ExportRouteService {
  constructor(
    public readonly http: HttpClient
  ) {
  }
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
}
