import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {Observable} from 'rxjs';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';

@Component({
    selector: 'app-main-navbar',
    templateUrl: './main-navbar.component.html',
    styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {
    

    user: Observable<User>;
    items: Item[];

    photoURL: string;

    public status = false;
    public menuClicked = false;

    constructor(public authService: AuthService, public  dataService: DataServiceService) {
    }

    animateOn() {
        this.status = !this.status;
    }

    showMenuBar() {
        this.menuClicked = !this.menuClicked;
    }

    ngOnInit() {
        this.authService.afAuth.authState.subscribe(user => {
            if (user) {
                this.photoURL = user.photoURL;
            }
        });
    }
}
