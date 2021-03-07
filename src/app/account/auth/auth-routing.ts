import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { DriveComponent } from './drive/drive.component';
import { ErrorComponent} from './error/error.component';
import { CancelComponent} from './cancel/cancel.component';
import { SuccessComponent} from './success/success.component';
import { ResetComponent } from './reset/passwordreset.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    // {
    //     path: 'signup',
    //     component: SignupComponent
    // },
    {
        path: 'forgot-password',
        component: PasswordresetComponent
    },
    {
        path: 'forgot-password/:token',
        component: ResetComponent
    },
    {path:'payment-success',component:SuccessComponent},
    {path:'payment-cancelled',component:CancelComponent},
    {path:'payment-failed',component:ErrorComponent},
    {path:'drive/:id',component:DriveComponent},
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
