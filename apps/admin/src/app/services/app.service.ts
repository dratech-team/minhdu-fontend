import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppEntity } from '../entities/app.entity';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable()
export class AppService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<AppEntity[]> {
    return this.http.get<AppEntity[]>(VersionEnum.V1 + 'application');
  }
}
