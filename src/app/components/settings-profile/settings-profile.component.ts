import {Component, NgZone, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';


@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css']
})
export class SettingsProfileComponent implements OnInit {

  constructor(private dataService: DataServiceService, private authService: AuthService, private ngZone: NgZone,
              private afAuth: AngularFireAuth, private router: Router, private toastr: ToastrService) {
  }

  items: Item[];
  user: User;
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL = '';
  edit = false;
  emailDisabled = false;
  file: File;
  progress: any = 0;

  toggleEdit() {
    this.edit = !this.edit;
  }


  updateFields() {
    if (this.firstName.length !== 0 && this.lastName.length !== 0) {
    this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
      firstname: this.firstName,
      lastname: this.lastName,
      displayName: this.firstName + ' ' + this.lastName
    }).then(r => {
      this.toastr.success('Data saved successfully.', 'Success!');
      this.toggleEdit();
    }).catch(r => {
      this.toastr.error('Data could not be saved' + r, 'Error!');
    });
    }
  }

  getExtendedData(item) {
    for (const it in item) {
      if (this.user.uid === item[it].uid) {
        this.firstName = item[it].firstname;
        this.lastName = item[it].lastname;
      }
    }
  }

  checkIfSocialOnline() {
    const providerData = firebase.auth().currentUser.providerData;
    if (providerData[0].providerId === 'google.com' ||
      providerData[0].providerId === 'facebook.com' ||
      providerData[0].providerId === 'github.com') {
      this.emailDisabled = true;
    }
  }

  deleteAccount() {
    this.authService.afs.collection('users').doc(firebase.auth().currentUser.uid).delete().then(
      r => firebase.auth().currentUser.delete().then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['sign-in']).then(() => window.location.reload());
        });
      }).catch((error) => {
        window.alert(error.message);
      }));

  }



  fileUpload(e: any) {
    let uploadPicInput = document.getElementById('picUpload');
    uploadPicInput.click();
    uploadPicInput.addEventListener('change', () => {
      this.file = e.target.files[0];

      let uploadTask = firebase.storage().ref(`Users/${this.user.uid}/profilePic/profilePic`).put(this.file);
      uploadTask.on('state_changed', (snapshot) => {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, (error) => {
        this.toastr.error('Data could not be saved!\n' + error.message, 'Error!');
        console.log(error);
      }, () => {
        this.toastr.success('Upload successfully.', 'Success!');
        this.progress = 0;
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          firebase.auth().currentUser.updateProfile({
            photoURL: url
          }).then(() => {
            this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
              photoURL: url,
            });
          });
        });
      });
    });
  }

  ngOnInit(): void {
    this.dataService.getItems().subscribe(items => {
      this.items = items;
      this.checkIfSocialOnline();
      this.getExtendedData(items);
    });

    this.dataService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    });

    const input = document.querySelector('input');
    input.addEventListener('input', evt => {
      const value = input.value.trim();
      console.log("here");
      if (value) {
        input.dataset.state = 'valid';
      } else {
        input.dataset.state = 'invalid';
      }
    });
  }
}
