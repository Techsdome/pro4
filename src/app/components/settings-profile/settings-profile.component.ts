import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import * as firebase from "firebase";


@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css']
})
export class SettingsProfileComponent implements OnInit {

  constructor(private dataService: DataServiceService, private authService: AuthService, private toastr: ToastrService) {
  }

  items: Item[];
  user: User;
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL = '';
  edit = false;
  emailDisabled = false;

  toggleEdit() {
    this.edit = !this.edit;
  }


  updateFields() {
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
  }

}
