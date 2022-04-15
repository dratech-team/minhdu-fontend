import {NgModule} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, DatePipe} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {MatSortModule} from '@angular/material/sort';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzPopoverModule} from 'ng-zorro-antd/popover';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    AkitaNgEffectsModule.forFeature([]),
    ReactiveFormsModule,
    FormsModule,
    NzMessageModule,
    NzModalModule,
    NzCollapseModule,
    NzRadioModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzPopoverModule,
  ],
  declarations: [],
  providers: [
    DatePipe,
  ]
})
export class SalaryModule {
}
