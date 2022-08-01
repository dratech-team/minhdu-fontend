import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppFooterModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    AppFooterModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class SharedModule {
}
