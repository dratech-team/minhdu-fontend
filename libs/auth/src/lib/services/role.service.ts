import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private readonly http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get<any>(VersionEnum.V2 + 'role');
  }
}
