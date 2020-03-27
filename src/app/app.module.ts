import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from './shared/services/auth.service';



// Firebase services + enviorment module
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    DashboardComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    MainNavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
