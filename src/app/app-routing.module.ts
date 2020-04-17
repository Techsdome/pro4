import {NgModule} from '@angular/core';
// Required services for navigation
import {Routes, RouterModule} from '@angular/router';

// Import all the components for which navigation service has to be activated

import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
// import { AuthGuard } from "../../shared/guard/auth.guard";
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {ProjectPageComponent} from './components/project-page/project-page.component';
import {NewProjectComponent} from './components/new-project/new-project.component';

// Import canActivate guard services
import {AuthGuard} from './shared/guard/auth.guard';
import {SecureInnerPagesGuard} from './shared/guard/secure-inner-pages.guard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {InputfieldComponent} from './components/inputfield/inputfield.component';
import {SettingsComponent} from './components/settings/settings.component';
import {SettingsProfileComponent} from './components/settings-profile/settings-profile.component';
import {SettingsSecurityComponent} from './components/settings-security/settings-security.component';


const routes: Routes = [
    {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
    {path: 'sign-in', component: SignInComponent},
    {path: 'register-user', component: SignUpComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'verify-email-address', component: VerifyEmailComponent},
    {path: 'project-page', component: ProjectPageComponent},
    {path: 'new-project', component: NewProjectComponent},
    {path: 'app-user-profile', component: UserProfileComponent},
    {path: 'app-settings', component: SettingsComponent},
    {path: 'app-settings-profile', component: SettingsProfileComponent},
    {path: 'app-settings-security', component: SettingsSecurityComponent}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
