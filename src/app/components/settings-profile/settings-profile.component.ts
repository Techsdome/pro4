import { Component, OnInit } from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.css']
})
export class SettingsProfileComponent implements OnInit {

  constructor(private dataService: DataServiceService, private authService: AuthService, private toastr: ToastrService) { }

  items: Item[];
  user: User;
  firstname: string;
  lastname: string;
  photoURL = '';
  edit = false;

  toggleEdit() {
    this.edit = !this.edit;
  }

  updateFields() {
    this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
      firstname: this.firstname,
      lastname: this.lastname,
      displayName: this.firstname + ' ' + this.lastname
    }).then(r => {
      this.toastr.success('Data saved successfully.', 'Success!');
    }).catch(r => {
      this.toastr.error('Data could not be saved' + r, 'Error!');
    });
  }

  getExtendedData(item) {
    for (const it in item) {
      if (this.user.uid === item[it].uid) {
        this.firstname = item[it].firstname;
        this.lastname = item[it].lastname;
        this.photoURL = item[it].photoURL;
      }
    }
  }


  ngOnInit(): void {
    this.dataService.getItems().subscribe(items => {
      this.items = items;
      this.getExtendedData(items);
    });

    this.dataService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

}
