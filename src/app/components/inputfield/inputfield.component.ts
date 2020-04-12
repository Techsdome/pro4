import {Component, OnInit} from '@angular/core';
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
    descriptionField: HTMLElement

    constructor(private dataService: DataServiceService, private authService: AuthService) {
    }

    saveData() {
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
        this.descriptionField = document.getElementById('description-textarea');
        this.descriptionField.style.height = '';
        this.descriptionField.style.height = this.descriptionField.scrollHeight + 'px';
        console.log(this.descriptionField);
        console.log(this.descriptionField.scrollHeight);

        this.dataService.getItems().subscribe(items => {
            this.items = items;
            this.getDescription(items);
        });

        this.dataService.getCurrentUser().subscribe(user => {
            this.user = user;
        });
    }

}
