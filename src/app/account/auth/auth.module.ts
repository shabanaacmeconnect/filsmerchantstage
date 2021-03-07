import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import {ResetComponent} from './reset/passwordreset.component'

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import {DriveComponent} from './drive/drive.component';
import { ErrorComponent} from './error/error.component';
import { CancelComponent} from './cancel/cancel.component';
import { SuccessComponent} from './success/success.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent,DriveComponent,
    ErrorComponent,SuccessComponent,CancelComponent,ResetComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UIModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
