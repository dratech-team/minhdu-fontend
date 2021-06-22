import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [CommonModule, RouterModule, MatMenuModule],
  declarations: [
    MouseRightComponent
  ],
  exports: [
    MouseRightComponent
  ],
})
export class ComponentsModule {}
