import {NgModule} from '@angular/core';
// Required services for navigation
import {Routes, RouterModule} from '@angular/router';

// Import all the components for which navigation service has to be activated
import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
//import { AuthGuard } from "../../shared/guard/auth.guard";
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {UserDashboardComponent} from './user/user-dashboard/user-dashboard.component';
import {UserListComponent} from './user/user-list/user-list.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';

const routes: Routes = [
    {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
    {path: 'sign-in', component: SignInComponent},
    {path: 'register-user', component: SignUpComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'verify-email-address', component: VerifyEmailComponent},
    {path: 'me', component: UserDashboardComponent, data: {title: 'Dashboard'}},
    {path: 'users', component: UserListComponent, data: {title: 'Users'}},
    {path: 'profile', component: UserDetailComponent, data: {title: 'profile'}}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
