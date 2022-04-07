import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {ComponentsModule} from '@minhdu-fontend/components';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {ConsignmentService} from './services';
import {ConsignmentEffect} from './state/consignment.effect';
import {CategoryService} from '../category/services';
import {NgxCurrencyModule} from 'ngx-currency';
import {customCurrencyMaskConfig} from '@minhdu-fontend/config';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {ConsignmentComponent} from "./container";

@NgModule({
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    AkitaNgEffectsModule.forFeature([ConsignmentEffect]),
    MatAutocompleteModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    MatExpansionModule,
    MatRadioModule,
    NzTableModule,
    NzModalModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule
  ],
  declarations: [
    ConsignmentComponent,
  ],
  exports: [
    ConsignmentComponent
  ],
  providers: [
    DatePipe,
    CategoryService,
    ConsignmentService
  ]
})
export class ConsignmentModule {
}
