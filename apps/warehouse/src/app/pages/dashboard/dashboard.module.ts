import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './container/dashboard/dashboard.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MenuDashboardComponent } from './components/menu-dash-board/menu-dashboard.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ItemUserManualDashboardComponent } from './components/item-user-manual-dash-board/item-user-manual-dashboard.component';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    NzButtonModule,
  ],
  declarations: [
    DashboardComponent,
    MenuDashboardComponent,
    ItemUserManualDashboardComponent,
  ],
})
export class DashboardModule {}
