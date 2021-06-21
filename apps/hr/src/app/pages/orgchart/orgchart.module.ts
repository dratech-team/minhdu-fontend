import { NgModule } from '@angular/core';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { OrgchartContainer } from './containers/orgchart.container';

const CONTAINERS = [OrgchartContainer];

@NgModule({
  imports: [
    OrgchartModule
  ],
  declarations: [CONTAINERS]
})
export class OrgchartPageModule {
}
