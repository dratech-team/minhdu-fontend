import { NgModule } from '@angular/core';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrgchartRoutingModule } from './orgchart-routing.module';
import { DialogPositionComponent } from './component/dialog-position/dialog-position.component';
import { PositionContainer } from './container/position/position.container';
import { BranchContainer } from './container/branch/branch.container';
import { DialogBranchComponent } from './component/dialog-branch/dialog-branch.component';
import { AllowanceBranchComponent } from './component/dialog-allowance-branch/allowance-branch.component';
import { DetailBranchContainer } from './container/detail-branch/detail-branch.container';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  imports: [
    ComponentsModule,
    StoreModule,
    EffectsModule,
    InfiniteScrollModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatProgressBarModule,
    MatProgressSpinnerModule,
    OrgchartRoutingModule,
    MatDialogModule,
    NzMessageModule,
  ],
  declarations: [
    DialogPositionComponent,
    PositionContainer,
    BranchContainer,
    DialogBranchComponent,
    AllowanceBranchComponent,
    DetailBranchContainer,
  ],
})
export class OrgchartModule {}
