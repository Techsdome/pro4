import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {DataServiceService} from '../../shared/services/data-service.service';
import {ActivatedRoute} from "@angular/router";
import {FormGroup} from '@angular/forms';

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

  editorForm: FormGroup;

  editorStyle = {
    justifyContent: 'center',
    alignContent: 'center',
    height: '200px',
    width: '50vw',
    backgroundColor: 'white',
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'size'],
      ['code-block', 'link'],
    ]
  };

  @Input() searchedUser: any;                          // The searched User of search bar
  private searchedUserId: any;
  profileOwner: boolean;

    constructor(private dataService: DataServiceService, private authService: AuthService, private route: ActivatedRoute) {
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
      this.route.params.subscribe(params => {
        this.searchedUserId = params.user;

      });

      this.dataService.getCurrentUser().subscribe(user => {
        this.user = user;
        if (this.searchedUserId === this.user.uid) {
          this.profileOwner = true;
        }
        if (this.searchedUser) {
          this.user = this.searchedUser;
        }
      });

      this.dataService.getItems().subscribe(items => {
        this.items = items;
        this.getDescription(items);
      });
    }

}
