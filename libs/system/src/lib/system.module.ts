import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AccountManagementComponent } from './containers/account-management/account-management.component';
import { AccountEffects } from './state/account-management/account.effects';
import { ComponentsModule } from '@minhdu-fontend/components';
import { SystemRoutingModule } from './system-routing.module';
import { RolePipe } from './pipes/role.pipe';
import { systemHistoryComponent } from './containers/system-history/system-history.component';
import { AppNamePipePipe } from './pipes/app-name.pipe';
import { MethodPipe } from './pipes/method.pipe';
import { LimitedAccessComponent } from './containers/limited-access/limited-access.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MatChipsModule } from '@angular/material/chips';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { SystemHistoryEffects } from './state/system-history/system-history.effects';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { OrgchartV2Module } from '@minhdu-fontend/orgchart-v2';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  imports: [
    SystemRoutingModule,
    ComponentsModule,
    CommonModule,
    AkitaNgEffectsModule.forFeature([SystemHistoryEffects, AccountEffects]),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    InfiniteScrollModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    MatChipsModule,
    NzCollapseModule,
    OrgchartV2Module,
    NzDatePickerModule,
  ],
  declarations: [
    systemHistoryComponent,
    AccountManagementComponent,
    RolePipe,
    AppNamePipePipe,
    MethodPipe,
    LimitedAccessComponent,
  ],
  exports: [AppNamePipePipe],
  providers: [],
})
export class SystemModule {}
