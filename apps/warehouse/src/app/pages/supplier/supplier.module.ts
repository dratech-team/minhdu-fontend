import { NgModule } from '@angular/core';
import { SupplierService } from './services';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { SupplierEffect } from './state';
import { SupplierComponent } from './container';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatExpansionModule } from '@angular/material/expansion';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatRadioModule } from '@angular/material/radio';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogSupplierComponent } from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  imports: [
    ComponentsModule,
    SupplierRoutingModule,
    MatExpansionModule,
    NzTableModule,
    MatRadioModule,
    NgxSkeletonLoaderModule,
    MatCheckboxModule,
    MatDialogModule,
    AkitaNgEffectsModule.forFeature([SupplierEffect]),
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    InfiniteScrollModule,
    NzCollapseModule,
    NzButtonModule,
    NzModalModule,
  ],
  declarations: [SupplierComponent, DialogSupplierComponent],
  providers: [SupplierService],
})
export class SupplierModule {}
