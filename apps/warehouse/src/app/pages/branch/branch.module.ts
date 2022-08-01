import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './container';
import { MatExpansionModule } from '@angular/material/expansion';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatRadioModule } from '@angular/material/radio';
import { ComponentsModule } from '@minhdu-fontend/components';
import { ModalBranchComponent } from './components';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  declarations: [BranchComponent, ModalBranchComponent],
  imports: [
    ComponentsModule,
    StoreModule,
    EffectsModule,
    InfiniteScrollModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BranchRoutingModule,
    MatExpansionModule,
    NzTableModule,
    MatRadioModule,
    NgxSkeletonLoaderModule,
    MatCheckboxModule,
    MatDialogModule,
    NzButtonModule,
    NzCollapseModule,
    NzSelectModule,
  ]
})
export class BranchModule {
}
