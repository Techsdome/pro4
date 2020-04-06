import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {AuthService} from './shared/services/auth.service';


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

import {MainNavbarComponent} from './components/main-navbar/main-navbar.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserDataComponent} from './components/user-data/user-data.component';

import {DataServiceService} from './shared/services/data-service.service';

const config = {
    apiKey: 'AIzaSyDbzgGQ8OdmDebUM_2pJKxc3dMwciV0Q80',
    authDomain: 'techsdome-6983c.firebaseapp.com',
    databaseURL: 'https://techsdome-6983c.firebaseio.com',
    projectId: 'techsdome-6983c',
    storageBucket: 'techsdome-6983c.appspot.com',
    messagingSenderId: '58706379716',
    appId: '1:58706379716:web:c4c479ff42b57beaf35a91',
    measurementId: 'G-LC8JXQGXSX'
};

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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        CoreModule,
        SharedModule,
        BrowserAnimationsModule
    ],
    providers: [AuthService, DataServiceService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
