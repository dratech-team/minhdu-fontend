import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {NzMessageModule} from "ng-zorro-antd/message";
import {RelativeService} from "./employee/services/relative.service";
import {DegreeService} from "./employee/services/degree.service";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {EmployeeEffect} from "./employee/state/employee.effects";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NzMessageModule,
    AkitaNgEffectsModule.forFeature([EmployeeEffect])
  ],
  providers:[
    RelativeService,
    DegreeService
  ]
})
export class EmployeeLibV2Module {}
