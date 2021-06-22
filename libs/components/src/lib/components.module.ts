import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MouseRightComponent } from './mouse-right/mouse-right.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    ContextMenuModule.forRoot({useBootstrap4: true, autoFocus: true ,})
  ],
  declarations: [
    MouseRightComponent
  ],
  exports: [
    MouseRightComponent
  ],
})
export class ComponentsModule {}
