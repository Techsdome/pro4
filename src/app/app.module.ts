import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthService} from './shared/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
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
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { UserStatusComponent } from './components/user-status/user-status.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { AddTagComponent } from './components/add-tag/add-tag.component';
import { PresentProjectsComponent } from './components/present-projects/present-projects.component';
import { SettingsProfileComponent } from './components/settings-profile/settings-profile.component';
import { SettingsSecurityComponent } from './components/settings-security/settings-security.component';
import { ShowPostComponent } from './components/show-post/show-post.component';
import { ShowAllPostsMainFeedComponent } from './components/show-all-posts-main-feed/show-all-posts-main-feed.component';
import {GeneralPostComponent} from './components/general-post/general-post.component';
import { ShowProjectsComponent } from './components/show-projects/show-projects.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { UploadImagesComponent } from './components/upload-images/upload-images.component';
import { QuillModule } from 'ngx-quill';
import { NewQuestionComponent } from './components/new-question/new-question.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {CreatePostNewComponent} from './components/create-post-new/create-post-new.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from "@angular/material/card";
import { ImageModalComponent } from './components/image-modal/image-modal.component';
import {MatChipsModule} from "@angular/material/chips";
import { ContributorViewComponent } from './components/contributor-view/contributor-view.component';
import { TagViewComponent } from './components/tag-view/tag-view.component';
import { ContributorInputComponent } from './components/contributor-input/contributor-input.component';
import { TagInputComponent } from './components/tag-input/tag-input.component';


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
        AddTagComponent,
        PresentProjectsComponent,
        SettingsProfileComponent,
        SettingsSecurityComponent,
        ShowPostComponent,
        ShowAllPostsMainFeedComponent,
        GeneralPostComponent,
        ShowProjectsComponent,
        UploadImageComponent,
        UploadImagesComponent,
        NewQuestionComponent,
        CreatePostNewComponent,
        ImageModalComponent,
        ContributorViewComponent,
        TagViewComponent,
        ContributorInputComponent,
        TagInputComponent
    ],
  imports: [
    MatTabsModule,
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
    NgbModule,
    FileUploadModule,
    FontAwesomeModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    ScrollToModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
    providers: [AuthService, DataServiceService, UploadTaskComponent, DropzoneDirective,
      NewProjectComponent, DashboardComponent, NgbModule, NgbActiveModal, { provide: LOCALE_ID, useValue: 'de-AT' }],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fas, far);
  }
}
