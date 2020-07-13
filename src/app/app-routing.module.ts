import {NgModule} from '@angular/core';
// Required services for navigation
import {Routes, RouterModule} from '@angular/router';

// Import all the components for which navigation service has to be activated

import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {ProjectPageComponent} from './components/project-page/project-page.component';
import {NewProjectComponent} from './components/new-project/new-project.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {SettingsComponent} from './components/settings/settings.component';
import {SettingsProfileComponent} from './components/settings-profile/settings-profile.component';
import {SettingsSecurityComponent} from './components/settings-security/settings-security.component';
import {ShowProjectsComponent} from './components/show-projects/show-projects.component';
import {PresentProjectsComponent} from './components/present-projects/present-projects.component';


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
    {path: 'app-settings-security', component: SettingsSecurityComponent},
    {path: 'show-posts', component: ShowProjectsComponent},
    {path: 'present-posts', component: PresentProjectsComponent},
    {path: 'show-project-post', component: ShowProjectsComponent},


];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
