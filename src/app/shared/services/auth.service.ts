import {Injectable, NgZone} from '@angular/core';
import {User} from './user';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    public userData: any; // Save logged in user data
    public firstname;
    public lastname;
    public online;

    constructor(
        public afs: AngularFirestore,     // Inject Firestore service
        public afAuth: AngularFireAuth,   // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone             // NgZone service to remove outside scope warning
    ) {
        /* Saving user data in localstorage when
        logged in and setting up null when logged out */
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userData = user;
                localStorage.setItem('user', JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem('user'));
            } else {
                localStorage.setItem('user', null);
                JSON.parse(localStorage.getItem('user'));
            }
        });
    }

    public getCurrentUser() {
        return this.afAuth.authState;
    }

    public getUserData() {
      return this.userData;
    }

    // Sign in with email/password
    SignIn(email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.ngZone.run(() => {
                    this.router.navigate(['dashboard']);
                });
            }).catch((error) => {
                window.alert(error.message);
            });
    }

    // Sign up with email/password
    SignUp(email, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
            /* Call the SendVerificaitonMail() function when new user sign
            up and returns promise */
            this.SendVerificationMail();
            this.SetUserData(result.user);
        }).catch((error) => {
            window.alert(error.message);
        });
    }

    setFirstName(firstname) {
        this.firstname = firstname;
    }

    setLastName(lastname) {
        this.lastname = lastname;
    }

    // Send email verfificaiton when new user sign up
    SendVerificationMail() {
        return this.afAuth.auth.currentUser.sendEmailVerification()
            .then(() => {
                this.router.navigate(['verify-email-address']);
            });
    }

    // Reset Forggot password
    ForgotPassword(passwordResetEmail) {
        return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            }).catch((error) => {
                window.alert(error);
            });
    }

    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null && user.emailVerified !== false) ? true : false;
    }

    // Sign in with Google
    GoogleAuth() {
        const google = new auth.GoogleAuthProvider();
        return this.AuthLogin(google);
        // this.addExtraFields();
        /*console.log(JSON.parse(JSON.stringify(google)));*/
    }

    addExtraFields() {
        this.afs.collection('users').doc(this.userData.uid).update({
            job: 'My job title',
            // description: 'Tell something about yourself..',
            // skills: [],
            firstname: this.firstname ? this.firstname : 'First Name',
            lastname: this.lastname ? this.lastname : 'Last Name'
        });
    }

    // Sign in with Facebooke
    FacebookAuth() {
        return this.AuthLogin(new auth.FacebookAuthProvider());
        // this.addExtraFields();
    }

    GithubAuth() {
        return this.AuthLogin(new auth.GithubAuthProvider());
    }

    // Auth logic to run auth providers
    AuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((result) => {
                this.ngZone.run(() => {
                    this.router.navigate(['dashboard']);
                });
                this.SetUserData(result.user);
                console.log(this.userData);
            }).catch((error) => {
                window.alert(error);
            });
    }

    /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */


    SetUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        const userData: any = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            job: user.job ? user.job : 'My job title',
            // description: user.description ? user.description : 'Tell something about yourself..',
            // skills: user.skills ? user.skills : [],
            firstname: this.firstname ? this.firstname : 'First Name',
            lastname: this.lastname ? this.lastname : 'Last Name',
        };

        return userRef.update(userData);
    }

    // Sign out
    SignOut() {
        return this.afAuth.auth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['sign-in']);
        });
    }

}
