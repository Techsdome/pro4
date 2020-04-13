import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';


@Component({
    selector: 'app-user-data',
    templateUrl: './user-data.component.html',
    styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

    items: Item[];
    user: User;
    job: string;
    public description: string;
    skills: string[];
    firstname: string;
    lastname: string;
    photoURL = '';
    edit = false;
    skill: string;


//    this.afs.collection('users').doc(this.userData.uid).update({});

    constructor(private dataService: DataServiceService, private authService: AuthService) {
    }

    editToggle() {
        this.edit = !this.edit;
        console.log(this.edit);
    }

    getExtendedData(item) {
        for (const it in item) {
            if (this.user.uid === item[it].uid) {
                this.job = item[it].job;
                this.description = item[it].description;
                this.skills = item[it].skills;
                this.firstname = item[it].firstname;
                this.lastname = item[it].lastname;
                this.photoURL = item[it].photoURL;
            }
        }
    }

    saveData() {
        this.skills.push(this.skill);
        if (this.edit) {
            this.edit = !this.edit;
        }
        this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
            skills: this.skills
        });
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
