data-service.service.ts

import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Item} from '../../models/Item';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataServiceService {
    public items: Observable<Item[]>;

    constructor(public afs: AngularFirestore, public authService: AuthService) {
        this.items = this.afs.collection('users').valueChanges();
    }


    getItems() {
        return this.items;
    }

    getCurrentUser() {
        return this.authService.getCurrentUser();
    }
}

user-data.html
<div *ngIf="user" id="user-data-container" class="flex">
    <img class="profile-picutre" [src]="user.photoURL?user.photoURL:'https://lh3.googleusercontent.com/proxy/e2HbKxgHu-YsHYQaUDXXKK_-nb1SLgz37uJbzp_Gfyee2jsywrpj6Yo6bLLL7vDkLXk__5mZu3hBnS3c65_EZzQ99fgvGHVsvnNMGK-WFoRSJXd1w5lq4KLQtStyfwPUTsH7dfU'" alt="">
    <div id="text-content">
        <h2>{{user.displayName?user.displayName:"Leeroy Jenkins"}}</h2>
        <hr>
        <p>Webentwickler</p>
        <!--<p>Email: {{user.email}}</p>-->
        <!--<p>Verifizierter User: {{user.emailVerified}}</p>-->
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet illum iure magni vel vitae. Aperiam consequatur incidunt laborum natus, nisi quibusdam sit veniam voluptatem. Inventore minus perferendis perspiciatis quia vero.</p>
    </div>
    <div id="skills-container">
        <h2>Skills</h2>
        <hr>
        <input type="button" value="java">
        <input type="button" value="java">
        <input type="button" value="java">
        <input type="button" value="java">
        <input type="button" value="java">
    </div>
</div>

user-data.component.ts
import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';


@Component({
    selector: 'app-user-data',
    templateUrl: './user-data.component.html',
    styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

    items: Item[];
    user: User;

    constructor(private dataService: DataServiceService) {
    }

    ngOnInit(): void {
        this.dataService.getItems().subscribe(items => {
            this.items = items;
        });

        this.dataService.getCurrentUser().subscribe(user => {
            this.user = user;
            console.log(this.user);
        });
    }
}


