import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {NzMessageModule} from "ng-zorro-antd/message";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {EmployeeEffect} from "./employee/state/employee";
import { PipesModule } from '@minhdu-fontend/pipes';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NzMessageModule,
    AkitaNgEffectsModule.forFeature([EmployeeEffect]),
    PipesModule
  ],
})
export class EmployeeLibV2Module {}
