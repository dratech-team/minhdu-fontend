import { NgModule } from '@angular/core';
import { OrgchartContainer } from './containers/orgchart/orgchart.container';
import { CommonModule } from '@angular/common';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrgchartRoutingModule } from './orgchart-routing.module';
import { DialogOrgChartComponent } from './components/dialog/dialog-org-chart.component';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const CONTAINERS = [OrgchartContainer];

@NgModule({
  imports: [
    OrgchartRoutingModule,
    OrgchartModule,
    CommonModule,
    OrgchartModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSkeletonLoaderModule.forRoot()
  ],
  declarations: [
    CONTAINERS,
    DialogOrgChartComponent,
    DialogDeleteComponent
  ]
})
export class OrgchartPageModule {
}
