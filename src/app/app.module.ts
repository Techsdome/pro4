import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthService} from './shared/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firebase services + enviorment module
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';

import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';

import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserDataComponent} from './components/user-data/user-data.component';

import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import {DataServiceService} from './shared/services/data-service.service';
import { InputfieldComponent } from './components/inputfield/inputfield.component';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {DropzoneDirective} from './shared/services/dropzone.directive';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploadTaskComponent } from './components/uploader/upload-task/upload-task.component';
import { PartingLineComponent } from './components/parting-line/parting-line.component';
import { ToastrModule } from 'ngx-toastr';
// import {NgbdProgressbarShowvalue} from './components/uploader/upload-task/progressbar-showvalue';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { UserStatusComponent } from './components/user-status/user-status.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { SettingsProfileComponent } from './components/settings-profile/settings-profile.component';
import { SettingsSecurityComponent } from './components/settings-security/settings-security.component';


@NgModule({
    declarations: [
        AppComponent,
        SignInComponent,
        DashboardComponent,
        SignUpComponent,
        ForgotPasswordComponent,
        VerifyEmailComponent,
        MainNavbarComponent,
        UserProfileComponent,
        UserDataComponent,
        ProjectPageComponent,
        NewProjectComponent,
        InputfieldComponent,
        DropzoneDirective,
        UploaderComponent,
        UploadTaskComponent,
        PartingLineComponent,
        UserStatusComponent,
        DropzoneDirective,
        UploaderComponent,
        UploadTaskComponent,
        SettingsComponent,
        ProfileMenuComponent,
        CreatePostComponent,
        SettingsProfileComponent,
        SettingsSecurityComponent,
      // NgbdProgressbarShowvalue

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        CoreModule,
        SharedModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule,
        ToastrModule.forRoot()
    ],
    providers: [AuthService, DataServiceService, UploadTaskComponent, DropzoneDirective],
    bootstrap: [AppComponent]
})
export class AppModule {
}
