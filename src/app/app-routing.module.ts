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
    {path: 'project-page/:project', component: ProjectPageComponent},
    {path: 'new-project', component: NewProjectComponent},
    {path: 'app-user-profile/:user', component: UserProfileComponent},
    {path: 'app-settings', component: SettingsComponent},
    {path: 'app-settings-profile', component: SettingsProfileComponent},
    {path: 'app-settings-security', component: SettingsSecurityComponent},
    {path: 'show-posts', component: ShowProjectsComponent},
    {path: 'present-posts', component: PresentProjectsComponent},
    {path: 'show-project-post', component: ShowProjectsComponent},
    {path: '**', component: DashboardComponent}
];


@NgModule({
    imports: [RouterModule.forRoot(routes, {
      // In order to get anchor / fragment scrolling to work at all, we need to
      // enable it on the router.
      anchorScrolling: 'enabled',

      // Once the above is enabled, the fragment link will only work on the
      // first click. This is because, by default, the Router ignores requests
      // to navigate to the SAME URL that is currently rendered. Unfortunately,
      // the fragment scrolling is powered by Navigation Events. As such, we
      // have to tell the Router to re-trigger the Navigation Events even if we
      // are navigating to the same URL.
      onSameUrlNavigation: 'reload',

      // Let's enable tracing so that we can see the aforementioned Navigation
      // Events when the fragment is clicked.
      enableTracing: false,
      scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
