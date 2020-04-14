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
    skills: string[] = ['test'];
    firstname: string;
    lastname: string;
    photoURL = '';
    edit = false;
    skill: string;
    htmlSkillElements: HTMLCollection;


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

    deleteSkill() {
        console.log(this.htmlSkillElements);
    }

    saveSkill() {
        if (this.skills === undefined) {
            this.skills = [];
        }
        this.skills.push(this.skill);
        if (this.edit) {
            this.edit = !this.edit;
        }
        this.updateSkillsFirebase();
    }

    updateSkillsFirebase() {
        this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
            skills: [] = this.skills
        });
    }


    deleteSkillElement(event) {
        for (let i = 0; i < this.skills.length; i++) {
            if (this.skills[i] === event.target.previousElementSibling.value) {
                this.skills.splice(i, 1);
            }
        }
        this.updateSkillsFirebase();
    }


    ngOnInit(): void {
        this.htmlSkillElements = (document.getElementsByClassName('skillDeleteButton') as HTMLCollection);
        document.addEventListener('DOMContentLoaded', () => {
            const skillsElement = document.getElementsByClassName('skillDeleteButton');
            console.log(skillsElement.length);
        });
        this.dataService.getItems().subscribe(items => {
            this.items = items;
            this.getExtendedData(items);
        });

        this.dataService.getCurrentUser().subscribe(user => {
            this.user = user;
        });
    }
}
