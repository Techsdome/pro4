import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {DataServiceService} from '../../shared/services/data-service.service';

@Component({
    selector: 'app-inputfield',
    templateUrl: './inputfield.component.html',
    styleUrls: ['./inputfield.component.css']
})
export class InputfieldComponent implements OnInit {
    public description: string;
    items: Item[];
    user: User;
    edit = false;

  @Input() searchedUser: any;                          // The searched User of search bar

    constructor(private dataService: DataServiceService, private authService: AuthService) {
    }

    editToggle() {
        this.edit = !this.edit;
    }

    saveData() {
        if (this.edit) {
            this.edit = !this.edit;
        }
        this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
            description: this.description
        });
    }

    getDescription(item) {
        for (const it in item) {
            if (this.user.uid === item[it].uid) {
                this.description = item[it].description;
            }
        }
    }

    ngOnInit(): void {
      if (this.searchedUser) {
        this.user = this.searchedUser;
      } else {
        this.dataService.getCurrentUser().subscribe(user => {
          this.user = user;
        });
      }

      this.dataService.getItems().subscribe(items => {
        this.items = items;
        this.getDescription(items);
      });
    }

}
