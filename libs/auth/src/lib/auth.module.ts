import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {AuthComponent} from './containers/auth.container';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LogoutComponent} from './components/dialog-logout.component/logout.component';
import {MatDialogModule} from '@angular/material/dialog';
import {RegisterComponent} from './components/dialog-register.component/register.component';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {DialogChangePassword} from './components/dialog-change-password/dialog-change-password';
import {NzButtonModule} from "ng-zorro-antd/button";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {AccountEffects} from "../../../system/src/lib/state/account-management/account.effects";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    AkitaNgEffectsModule.forFeature([AccountEffects]),
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    NzButtonModule,
    NzSelectModule,
  ],
  declarations: [
    RegisterComponent,
    LogoutComponent,
    AuthComponent,
    DialogChangePassword
  ],
  providers: [
  ]
})
export class AuthModule {
}
